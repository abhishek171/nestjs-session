import { Module } from '@nestjs/common';
import { UserRepository } from './user/user.repository';
import { LoggerService} from '@app/common/logger';
import { BaseRepositoryModule } from './base/datastore.module';


@Module({
    imports: [BaseRepositoryModule],
    providers:[UserRepository,LoggerService],
    exports:[UserRepository]
})
export class RepositoryModule {}
