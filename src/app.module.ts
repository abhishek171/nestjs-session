import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AuthModule} from '@app/identity-auth';
import { CommonModule, RequestLoggerMiddleware, ResponseLoggerMiddleware } from '@app/common';
import { CoreModule } from './core/core.module';
import { ConfigModule } from '@nestjs/config';
import { ModulesModule } from './modules/modules.module';

@Module({
  imports: [ 
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [`.env`] 
    }),
    CoreModule,
    ModulesModule,
    CommonModule,
    AuthModule,
  ]
})

export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(RequestLoggerMiddleware,ResponseLoggerMiddleware)
      .forRoutes('*'); 
  }
  
}