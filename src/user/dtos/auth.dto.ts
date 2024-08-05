import { UserType } from '@prisma/client';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNotIn,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';

export class RegisterDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @Matches(/^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]{4,12}$/, {
    message: 'Invalid phone number',
  })
  phone: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(5)
  password: string;
}

export class RegisterAdminDto extends RegisterDto {
  @IsEnum(UserType)
  @IsNotIn([UserType.BUYER])
  type: UserType;
}

export class LoginDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(5)
  password: string;
}
