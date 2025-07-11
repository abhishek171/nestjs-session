import { BadRequestException, ConflictException, ForbiddenException, Inject, Injectable, Logger, NotFoundException, ServiceUnavailableException, UnauthorizedException } from '@nestjs/common';
import { LoginDto, UpdatedUserDto, UserDto } from './dto/user.dto';
import { LoggerService } from '@app/common/logger';
import { FindOptions } from 'sequelize';
import { AuthService } from '@app/identity-auth';
import { UserRepository } from 'src/repository/user/user.repository';
import { AuthDto } from './dto/auth.dto';
import { User } from 'src/repository/models/User.model';
import * as bcrypt from 'bcryptjs';
import { File } from 'multer';
import { deleteFromCloudinary, extractPublicIdFromUrl, uploadToCloudinary } from 'src/utilities/utils/cloudinary.helper';
import {ICloudinaryResponse, IProfileImageUpdateResponse, IUserOperationSuccessResponse, IUserTokenResponse, TUserResponse } from './interface/IUserResponse';
@Injectable()
export class UserService {
   
  constructor(
    private logger:LoggerService,
    private readonly userRepository:UserRepository,
    private readonly authService:AuthService,
  ){}

  async createUser(userData: UserDto):Promise<IUserOperationSuccessResponse>{
    try {
      this.logger.log("Create User",UserService.name);
    
      const isUserExist = await this.userRepository.findOneByQuery({where:{email:userData.email,mobile:userData.mobile}});
     if(isUserExist){
      throw new ConflictException("User Already Exist");
     }
     userData.password = await bcrypt.hash(userData.password, 10);
     
     const userAdded = await this.userRepository.create(userData);
     if(!userAdded){
      throw new ServiceUnavailableException("Database Error");
     }
     return {message:"User Added Successfully"};
    } catch (error) {
      this.logger.error(error,UserService.name);
      throw error;
    }
  }

  async userLogin(loginInfo: LoginDto):Promise<IUserTokenResponse>{
    try {
      this.logger.log("User Login",UserService.name);
      const userExist = await this.userRepository.findByEmail(loginInfo.email);
      const userInfo = userExist?.dataValues
      if(!userExist){
        throw new NotFoundException("User Not Found");
      }
      const isMatch = await bcrypt.compare(loginInfo.password,userInfo['password']);
      if(!isMatch){
        throw new ForbiddenException("Invalid Credentials");
      }
      const tokenPayload = {
        id:userInfo['userId'],
        email:userInfo['email']
      }
      const {accessToken,refreshToken} = await this.authService.create(tokenPayload);
      const updateUserInfo:Partial<User> = {
        accessToken:accessToken,
        refreshToken:refreshToken,
        isActive:true
      }
      const userUpdated = await this.userRepository.update(userInfo['userId'],updateUserInfo);
      if(!userUpdated){
        throw new ServiceUnavailableException("Database Error");
      }
      return {
        accessToken:accessToken
      }
    } catch (error) {
      this.logger.error(error,UserService.name);
      throw error;
    }
  }
 
  async refreshToken(authData: AuthDto):Promise<IUserTokenResponse>{
    try {
      this.logger.log('Generate New Access Token',UserService.name);
      let tokenData = await this.authService.refresh(authData);
      const { accessToken,id} = tokenData;
      const data: Partial<User> = {
        accessToken: accessToken
      };
      const updateTokenData = await this.userRepository.update(id, data);
      if (updateTokenData) {
        return { accessToken: accessToken };
      } else {
        throw new ServiceUnavailableException('Database Error');
      }
    } catch (err) {
      this.logger.error(err,UserService.name);
      throw err;
    }
  }

  async findUser(id:number):Promise<TUserResponse>{
    try {
      this.logger.log("Get User Details",UserService.name);
      const filter:FindOptions= {
        where:{
          userId : id
        }
      }
      const userDetails = await this.userRepository.findOneByQuery(filter);
      if(!userDetails?.dataValues){
        throw new NotFoundException("User Not Found");
      }
      const {accessToken,refreshToken,password,...userInfo} = userDetails.dataValues;
      return {user:userInfo}
    } catch (error) {
      this.logger.error(error,UserService.name);
      throw error;
    }
  }

  async updateUser(userId:number, updateUser: Partial<UpdatedUserDto>):Promise<TUserResponse>{
    try {
      this.logger.log("Update User",UserService.name);
      if(updateUser.password){
        updateUser.password = await bcrypt.hash(updateUser.password,10);
      }
      const updatedUser = await this.userRepository.update(userId,updateUser);
      if(!updatedUser){
        throw new NotFoundException("User Not Found");
      }
      const {refreshToken,accessToken,password,...userData} = updatedUser[1][0]?.dataValues;
      return{user:userData,message:"User Updated Successfully"};
    } catch (error) {
      this.logger.error(error,UserService.name);
      throw error
    }
  }

  async fileUpload(file: File,id:number):Promise<IProfileImageUpdateResponse>{
    try {
      this.logger.log("Upload Profile Pic",UserService.name);
      const filter:FindOptions= {
        where:{
          userId : id
        }
      }
      const userDetails = await this.userRepository.findOneByQuery(filter);
      if(!userDetails){
        throw new NotFoundException("User Not Found");
      }
      let userInfo = userDetails.dataValues;
      const updatedProfilePic = await this.uploadImageToCloudinadry(userInfo['profileImage'],file);
      const updateUserPic:Partial<User> = {
        profileImage:updatedProfilePic?.secure_url
      }
      await this.userRepository.update(id,updateUserPic);

      return {
        profileImage:updatedProfilePic.secure_url
      }
    } catch (error) {
       this.logger.error(error,UserService.name);
       throw error;
    }
  }

  async decativateUser(userId:number):Promise<IUserOperationSuccessResponse>{
    try {
      this.logger.log("Deactivate User",UserService.name);
      const updateUser:Partial<User> = {
        isActive:false
      }
      const userUpdated = await this.userRepository.update(userId,updateUser);
      if(!userUpdated){
        throw new NotFoundException("User Not Found");
      }
      return {message:"User Deactivated"};
    } catch (error) {
      this.logger.error(error,UserService.name);
      throw error;
    }
  }

  async uploadImageToCloudinadry(profilePicUrl:string,file:File):Promise<ICloudinaryResponse>{
      if(profilePicUrl){
        const publicId = extractPublicIdFromUrl(profilePicUrl);
        await deleteFromCloudinary(publicId);
      }
      return await uploadToCloudinary(file);
  }
}
