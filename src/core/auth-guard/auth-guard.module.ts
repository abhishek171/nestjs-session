import { AuthModule } from "@app/identity-auth";
import { Module } from "@nestjs/common";
import { AuthGuard } from "./auth.guard";
import { LoggerService } from "@app/common";

@Module({
    imports:[AuthModule],
    providers:[AuthGuard,LoggerService],
    exports:[AuthGuard]
})
export class AuthGuardModule{}