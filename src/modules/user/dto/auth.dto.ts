import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class AuthDto{
    @ApiProperty({description:"JWT Token Required"})
    @IsString()
    accessToken:string;
}