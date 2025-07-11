import { LoggerService} from '@app/common/logger';
import { Module } from '@nestjs/common';
import { AppDatabaseModule } from 'src/core/database-config/database.module';

@Module({
    imports: [AppDatabaseModule],
    providers:[LoggerService]
})
export class BaseRepositoryModule {}
