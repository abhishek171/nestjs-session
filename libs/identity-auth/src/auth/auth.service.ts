import { Injectable, Logger } from '@nestjs/common';
import { AuthRepository } from './auth.repository';
import { ICreateTokenResponse, IRefreshTokenResponse, IVerifyTokenResponse } from './interface/IResponse';
import { ITokenPayload } from './interface/IRequest';

@Injectable()
export class AuthService{
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly loggerService:Logger
  ){} 

  async create(authDto: ITokenPayload):Promise<ICreateTokenResponse>{
    this.loggerService.log(`Create`,AuthService.name);
    return this.authRepository.create(authDto);
  }

  async refresh({ accessToken }: { accessToken: string }):Promise<IRefreshTokenResponse>{
    this.loggerService.log(`Refresh`,AuthService.name);
    return this.authRepository.refresh(accessToken);
  }
  
  async verify({ accessToken }: { accessToken: string }): Promise<IVerifyTokenResponse>{
    this.loggerService.log(`Verify `,AuthService.name);
    return this.authRepository.verify(accessToken);
  }
}
