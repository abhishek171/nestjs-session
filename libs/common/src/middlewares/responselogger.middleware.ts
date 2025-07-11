import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class ResponseLoggerMiddleware implements NestMiddleware {
  
  use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl } = req;
    const start = Date.now();
    const chunks: Buffer[] = [];

    const originalWrite = res.write;
    const originalEnd = res.end;

    res.write = (...args: any[]): boolean => {
      if (args[0]) chunks.push(Buffer.from(args[0]));
      return originalWrite.apply(res, args);
    };

    res.end = (...args: any[]): any => {
      if (args[0]) chunks.push(Buffer.from(args[0]));
      return originalEnd.apply(res, args);
    };

    res.on('finish', () => {
      const duration = Date.now() - start;
      const body = Buffer.concat(chunks).toString('utf8');
      console.debug(`<- [${method}] ${originalUrl} ${res.statusCode} - ${duration}ms`, ResponseLoggerMiddleware.name);
      console.debug(`Response Body: ${body}`, ResponseLoggerMiddleware.name);
    });

    res.on('close', () => {
      if (!res.writableEnded) {
        const duration = Date.now() - start;
        console.warn(`<- [${method}] ${originalUrl} CLOSED early after ${duration}ms`, ResponseLoggerMiddleware.name);
      }
    });

    next();
  }
}
