import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MODELS } from '../../repository/models/include.model';

@Module({
  imports: [
    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        dialect: configService.get<'mysql' | 'postgres' | 'sqlite'>('DB_DIALECT')!,
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USER'),
        password: configService.get<string>('DB_PASS'),
        database: configService.get<string>('DATABASE_NAME'),
        logging: configService.get<string>('DB_LOGS') === 'true',
        models: MODELS, 
        synchronize: true,
      }),
    }),
    SequelizeModule.forFeature(MODELS), 
  ],
  exports: [SequelizeModule],
})
export class AppDatabaseModule {}
