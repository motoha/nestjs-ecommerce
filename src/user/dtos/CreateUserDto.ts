import { IsString, IsEmail, IsOptional, IsEnum } from 'class-validator';
import { UserType } from '@prisma/client';

export class CreateUserDto {
  @IsString()
  name: string;

  @IsString()
  phone: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsEnum(UserType)
  @IsOptional()
  type?: UserType;

  @IsString()
  @IsOptional()
  firstName?: string;

  @IsString()
  @IsOptional()
  lastName?: string;

  @IsString()
  @IsOptional()
  address?: string;

  @IsString()
  @IsOptional()
  address_line1?: string;

  @IsString()
  @IsOptional()
  address_line2?: string;

  @IsString()
  @IsOptional()
  city?: string;

  @IsString()
  @IsOptional()
  state?: string;

  @IsString()
  @IsOptional()
  postal_code?: string;

  @IsString()
  @IsOptional()
  country?: string;

  @IsString()
  @IsOptional()
  profilePict?: string; 
}