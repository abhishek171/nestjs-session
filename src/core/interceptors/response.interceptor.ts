import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request, Response } from 'express';
import { map } from 'rxjs/operators';

@Injectable()
export class ResponseTransformInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {

    const request = context.switchToHttp().getRequest<Request>();

    if (
      request.method === 'GET' ||
      request.method === 'POST' ||
      request.method === 'PUT' ||
      request.method === 'PATCH' ||
      request.method === 'DELETE'
    ) {
      return next.handle().pipe(
        map((data) => {
          const response: Response = context.switchToHttp().getResponse();
          const mappedResponse = {
            statusCode: response.statusCode,
            data,
            fieldErrors: [],
            error: false,
          };


          return mappedResponse;
        }),
      );
    } else {
      return next.handle();
    }
  }

}
