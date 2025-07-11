import {
  BadRequestException,
  HttpStatus,
  Injectable,
  Logger,
  NotFoundException,
  ServiceUnavailableException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { FindOptions, Op } from 'sequelize';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './dataModels/auth-user.model';
import { ICreateTokenResponse, IRefreshTokenResponse, IVerifyTokenResponse } from './interface/IResponse';
import { ITokenPayload } from './interface/IRequest';

@Injectable()
export class AuthRepository {
 
  constructor(
    @InjectModel(User) private userModel: typeof User,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private loggerService: Logger,
  ) {}

  public async create(authDto: ITokenPayload):Promise<ICreateTokenResponse>{
    try {
      this.loggerService.log('Create Token', AuthRepository.name);
      
      const accessToken = await this.createAccessToken(
        authDto
      );
      const refreshToken = await this.createRefreshToken(
        authDto
      );
      return { accessToken, refreshToken };
    } catch (err:any) {
      this.loggerService.error(err, AuthRepository.name);
      throw new Error(err);
    }
  }

  public async refresh(accessToken: string): Promise<IRefreshTokenResponse> {
    try {
      this.loggerService.log('Refresh Token', AuthRepository.name);
      if(!accessToken){
        throw new BadRequestException("Access Token Required");
      }
      const filter: FindOptions = {
        where: { accessToken, isActive: true },
      };
      
      const userInstance = await this.userModel.findOne(filter);
      if(!userInstance){
        throw new UnauthorizedException("Invalid Access Token");
      }
      const user = userInstance?.dataValues;
      const decodedTokenData = await this.verifyAndDecodeToken(user.refreshToken);
      console.log(decodedTokenData)
      const { id, email } = decodedTokenData;
      const payload = { id, email };
      const newAccessToken = await this.createAccessToken(payload);
      return { id, accessToken: newAccessToken };

    } catch (err: any) {
      this.loggerService.error(err, AuthRepository.name);
      console.log(err)
      if (err.name === 'TokenExpiredError') {
        throw new UnauthorizedException('Refresh Token Expired');
      }
      throw err;
    }
  }

  public async verify(accessToken: string): Promise<IVerifyTokenResponse> {
    try {
      this.loggerService.log('Verify Token', AuthRepository.name);
      if(!accessToken){
        throw new BadRequestException("Access Token Required");
      }
      const decodedTokenData = await this.verifyAndDecodeToken(accessToken);
      const { id, email } = decodedTokenData;
      let user: User | null = await this.userModel.findOne({
        where: { userId: id, email, accessToken, isActive: true },
      });
      if (!user) {
        throw new NotFoundException('User not found');
      }
      user = user?.dataValues;
      return { user: { id } };
    } catch (err: any) {
      this.loggerService.error(err, AuthRepository.name);
      if (err.name === 'TokenExpiredError') {
        throw new UnauthorizedException('Access Token Expired');
      } else if (err.name === 'JsonWebTokenError') {
        throw new UnauthorizedException('Invalid Access Token');
      }
      throw err;
    }
  }

  private async verifyAndDecodeToken(token: string) {
    return await this.jwtService.verifyAsync(token, {
      secret: this.configService.get('SECRETKEY'),
    });
  }

  private async createAccessToken(payload: ITokenPayload) {
    return this.jwtService.sign(payload, {
      expiresIn: this.configService.get('ACCESSTOKEN_EXPIRES_IN'),
    });
  }

  private async createRefreshToken(payload: ITokenPayload) {
    return this.jwtService.sign(payload, {
      expiresIn: this.configService.get('REFRESHTOKEN_EXPIRES_IN'),
    });
  }
}