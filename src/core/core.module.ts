import { Module } from '@nestjs/common';
import { AppDatabaseModule } from './database-config/database.module';
import { AuthGuardModule } from './auth-guard/auth-guard.module';

@Module({
  imports: [
    AppDatabaseModule,
    AuthGuardModule
  ],
})
export class CoreModule {}
