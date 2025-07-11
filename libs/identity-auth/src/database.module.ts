import { Module, Global, OnModuleInit} from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Sequelize } from 'sequelize-typescript'; 
import { User } from './auth/dataModels/auth-user.model';

@Global()
@Module({
  imports: [
    ConfigModule,  
    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        dialect: configService.get('DB_DIALECT'),
        host: configService.get<string>('DB_HOST')!,
        port: configService.get<number>('DB_PORT')!,
        username: configService.get<string>('DB_USER')!,
        password:configService.get<string>('DB_PASS')!,
        database:configService.get<string>('DATABASE_NAME')!,
        define:{
            timestamps:false
          },
        models: [User], 
        synchronize: configService.get<boolean>('DB_SYNC_ALTER'),  
        logging: false,  
      }),
      inject: [ConfigService],
    }),
    SequelizeModule.forFeature([User]),
  ],
  
  exports: [SequelizeModule],
})
export class DatabaseModule implements OnModuleInit {
  constructor(
    private readonly sequelize: Sequelize
  ) {}

  async onModuleInit() {
    try {
      const sequelize = await this.sequelize.sync({force:false})
      return sequelize;

    } catch (error) {
      console.error('Unable to connect to the database:', error);
    }
  }
}
