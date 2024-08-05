import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from './auth.service';
import { LoginDto, RegisterAdminDto, RegisterDto } from '../dtos/auth.dto';
import { UserType } from '@prisma/client';
import { AuthGuard } from 'src/guards/auth.guard';
import { Roles } from 'src/decorators/roles.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
  async register(@Body() body: RegisterDto) {
    return await this.authService.addUser({ ...body, type: UserType.BUYER });
  }

  @Roles(UserType.ADMIN)
  @UseGuards(AuthGuard)
  @Post('/register-admin')
  async registerAdmin(@Body() body: RegisterAdminDto) {
    return await this.authService.addUser(body);
  }

  @Post('/login')
  async login(@Body() body: LoginDto) {
    return await this.authService.login(body);
  }

  @UseGuards(AuthGuard)
  @Get('/profile')
  async getProfile(@Req() req: Request) {
    return req.user;
  }
}
