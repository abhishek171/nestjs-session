import {
  IsEmail,
  IsString,
  MinLength,
  MaxLength,
  Length,
  IsEnum,
  IsOptional,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { OmitType, PickType } from '@nestjs/mapped-types';

export enum GenderEnum {
  Male = 'Male',
  Female = 'Female',
  Others = 'Others',
}

export class UserDto {
  @ApiProperty({ example: 'John', description: 'First name of the user' })
  @IsString()
  firstName: string;

  @ApiProperty({ example: 'Doe', description: 'Last name of the user' })
  @IsString()
  lastName: string;

  @ApiProperty({ example: 'john@example.com', description: 'Email address' })
  @IsEmail({}, { message: 'Invalid email address' })
  email: string;

  @ApiProperty({
    example: 'SecurePass123',
    description: 'Password (8-16 characters)',
    minLength: 8,
    maxLength: 16,
  })
  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @MaxLength(16, { message: 'Password cannot exceed 16 characters' })
  password: string;

  @ApiProperty({
    description: 'Gender of the user',
    enum: GenderEnum,
    example: GenderEnum.Male,
  })
  @IsEnum(GenderEnum, { message: 'Gender must be Male, Female, or Others' })
  gender: GenderEnum;

  @ApiProperty({ example: '+91', description: 'Country code (2-5 characters)' })
  @IsString()
  @Length(2, 5)
  countryCode: string;

  @ApiProperty({ example: '9876543210', description: 'Mobile number (10-15 digits)' })
  @IsString()
  @Length(10, 15)
  mobile: string;
}


// export class LoginDto extends PickType(UserDto, ['email', 'password'] as const) {}
export class LoginDto {
  @ApiProperty({ example: 'john@example.com', description: 'Email address' })
  @IsEmail({}, { message: 'Invalid email address' })
  email: string;

  @ApiProperty({
    example: 'SecurePass123',
    description: 'Password (8-16 characters)',
    minLength: 8,
    maxLength: 16,
  })
  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @MaxLength(16, { message: 'Password cannot exceed 16 characters' })
  password: string;
}


// export class UpdatedUserDto extends OmitType(UserDto, ['email'] as const) {}

export class UpdatedUserDto{
  @ApiPropertyOptional()
  @ApiProperty({ example: 'John', description: 'First name of the user' })
  @IsOptional()
  @IsString()
  firstName: string;

  @ApiPropertyOptional()
  @ApiProperty({ example: 'Doe', description: 'Last name of the user' })
  @IsOptional()
  @IsString()
  lastName: string;

  @ApiPropertyOptional()
  @ApiProperty({
    example: 'SecurePass123',
    description: 'Password (8-16 characters)',
    minLength: 8,
    maxLength: 16,
  })
  @IsOptional()
  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @MaxLength(16, { message: 'Password cannot exceed 16 characters' })
  password: string;

  @ApiPropertyOptional()
  @ApiProperty({
    description: 'Gender of the user',
    enum: GenderEnum,
    example: GenderEnum.Male,
  })
  @IsOptional()
  @IsEnum(GenderEnum, { message: 'Gender must be Male, Female, or Others' })
  gender: GenderEnum;

  @ApiPropertyOptional()
  @ApiProperty({ example: '+91', description: 'Country code (2-5 characters)' })
  @IsOptional()
  @IsString()
  @Length(2, 5)
  countryCode: string;

  @ApiPropertyOptional()
  @ApiProperty({ example: '9876543210', description: 'Mobile number (10-15 digits)' })
  @IsOptional()
  @IsString()
  @Length(10, 15)
  mobile: string;
}

