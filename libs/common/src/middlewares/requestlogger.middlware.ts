import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class RequestLoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction): void {
    const { method, originalUrl } = req;
    const userAgent = req.get('user-agent') || '';
    const clientIp = req.socket.remoteAddress || req.headers['x-forwarded-for'];

    res.on('close', () => {
      const { statusCode } = res;
      console.debug(
        `${method} ${originalUrl} ${statusCode} - ${userAgent} Ip-${clientIp}`,
      );
    });

    next();
  }
}
