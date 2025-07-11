import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { LoggerService} from '@app/common/logger';
import { AuthModule } from '@app/identity-auth';
import { RepositoryModule } from 'src/repository/repository.module';

@Module({
  imports:[AuthModule,RepositoryModule,],
  controllers: [UserController],
  providers: [UserService,LoggerService]
})
export class UserModule {}
