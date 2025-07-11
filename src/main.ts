import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionsFilter} from '@app/common';
import helmet from 'helmet';
import { AuthGuard } from './core/auth-guard/auth.guard';
import {ResponseTransformInterceptor } from './core/interceptors/response.interceptor';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    methods: ['GET','POST','PATCH','DELETE'],
    credentials: true
  });
   const config = new DocumentBuilder()
    .setTitle('User Api')
    .setDescription('API documentation')
    .setVersion('1.0')
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      name: 'Authorization',
    },
    'access-token') 
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api',app, document);
  app.use(helmet());
  app.useGlobalInterceptors(new ResponseTransformInterceptor());
  app.useGlobalGuards(app.get(AuthGuard));
  app.useGlobalFilters(new HttpExceptionsFilter());
  await app.listen(process.env.APP_PORT ?? 5001);
}
bootstrap();
