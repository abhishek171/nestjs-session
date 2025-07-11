/* eslint-disable prettier/prettier */
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { IncomingHttpHeaders } from 'http';
import { AuthService } from '@app/identity-auth';
import { excludedRoutes } from './excluded.routes';
import { JsonWebTokenError, TokenExpiredError } from '@nestjs/jwt';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private authService:AuthService
  ) {}
  
  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const request = context.switchToHttp().getRequest<Request>();
      const url = request.url.split('?')[0];

      if (excludedRoutes.includes(url)) {
        return true;
      }
      const token = this.extractAuthorizationHeader(request.headers);

      if (!token) {
      return false;
    }

    const decodedValue = await this.validateAndDecodeToken(token, 'Bearer');
      if (!decodedValue || !decodedValue.user) {
        return false;
      }
      const { user } = decodedValue;
      if (!user) {
        return false;
      }
      request['user'] = user;
      return true;
    } catch (error) {
    throw error;
    }
  }

  private extractAuthorizationHeader(
    headers: IncomingHttpHeaders,
  ): string | null {
     const accessToken = headers['authorization'] || headers['Authorization'];

      if (typeof accessToken === 'string' && accessToken.startsWith('Bearer ')) {
        return accessToken;
      }

      return null;
  }

  private async validateAndDecodeToken(token: string, type: string) {
    if (!token || !type) {
      return false;
    }

    const splittedToken = token.split(' ');

    if (splittedToken.length != 2) {
      return false;
    }

    if (splittedToken[0] !== type) {
      return false;
    }

    const isValidToken = await this.authService.verify({
      accessToken: splittedToken[1],
    });

    return isValidToken;
  }
}
