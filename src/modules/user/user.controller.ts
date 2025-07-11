import { Controller, Get, Post, Body, Patch, Delete, ValidationPipe, HttpCode, Query, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { UserService } from './user.service';
import { LoginDto, UpdatedUserDto, UserDto } from './dto/user.dto';
import { LoggerService } from '@app/common/logger';
import { AuthDto } from './dto/auth.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { File } from 'multer';
import { CurrentUserId } from './decorator/getCurrentUserId.decorator';
import { ParseIdIntPipe } from './pipes/parseInt.pipes';
import { ApiTags} from '@nestjs/swagger';
import { IProfileImageUpdateResponse, IUserOperationSuccessResponse, IUserTokenResponse, TUserResponse } from './interface/IUserResponse';
import { SwaggerLoginUser, SwaggerProfilePicUpload, SwaggerRefreshToken, SwaggerRegisterUser, SwaggerUserRoutes } from './decorator/swagger.decorator';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(
    private readonly logger:LoggerService,
    private readonly userService: UserService) {}

  @Post('register')
  @HttpCode(201)
  @SwaggerRegisterUser()
  async register(@Body(new ValidationPipe()) createUser:UserDto):Promise<IUserOperationSuccessResponse>{
    this.logger.log("Create User Controller",UserController.name);
    return this.userService.createUser(createUser);
  }

  @Post('login')
  @HttpCode(200)
  @SwaggerLoginUser()
  async userLogin(@Body(new ValidationPipe()) loginInfo:LoginDto):Promise<IUserTokenResponse>{
    this.logger.log("User Login",UserController.name);
    return this.userService.userLogin(loginInfo);
  }

  @Post('generate/token')
  @HttpCode(200)
  @SwaggerRefreshToken()
  async generateNewToken(
  @Body(new ValidationPipe()) token:AuthDto
  ):Promise<IUserTokenResponse>{
    this.logger.log("Generate-Token",UserController.name);
    return this.userService.refreshToken(token);
  }

  @Get()
  @HttpCode(200)
  @SwaggerUserRoutes('Get user', 'User retrieved successfully')
  async findOne(@CurrentUserId(ParseIdIntPipe)userId:number):Promise<TUserResponse>{
    this.logger.log("Get User",UserController.name);
    return this.userService.findUser(userId);
  }

  @HttpCode(200)
  @Patch()
  @SwaggerUserRoutes('Update user info', 'User updated successfully')
  async update(@CurrentUserId() userId:number,@Body(new ValidationPipe({whitelist:true,forbidNonWhitelisted:true})) updateUserDto:UpdatedUserDto):Promise<TUserResponse>{
    this.logger.log("Update User Controller",UserController.name);
    return this.userService.updateUser(userId,updateUserDto);
  }

  @HttpCode(200)
  @UseInterceptors(FileInterceptor('file')) 
  @Post('profile/pic-upload')
  @SwaggerProfilePicUpload()
  async fileUpload(@UploadedFile() file:File,@CurrentUserId(ParseIdIntPipe) userId:number):Promise<IProfileImageUpdateResponse> {
    this.logger.log('Update User Controller', UserController.name);
    if(!file){
      throw new BadRequestException("File Required");
    }
    return this.userService.fileUpload(file,userId);
  }

  @HttpCode(200)
  @Delete('deactivate')
  @SwaggerUserRoutes('Deactivate user', 'User deactivated successfully')
  async deactivateUser(@CurrentUserId(ParseIdIntPipe) userId:number):Promise<IUserOperationSuccessResponse>{
    this.logger.log("Deactivate User Controller",UserController.name);
    return this.userService.decativateUser(userId);
  }
}
