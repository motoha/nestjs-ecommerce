import { Body, Controller, Get, Post, UseInterceptors, Put,Req, UseGuards,UsePipes, ValidationPipe, HttpStatus, HttpException, Param, NotFoundException, UploadedFile  } from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from './auth.service';
import { LoginDto, RegisterAdminDto, RegisterDto } from '../dtos/auth.dto';
import { UserType } from '@prisma/client';
import { AuthGuard } from 'src/guards/auth.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { IUser } from 'src/utils/user.interface';
import { ApiError } from 'src/utils/apiError';
import { FileInterceptor } from '@nestjs/platform-express';
import { Logger } from '@nestjs/common';
import { UpdateUserDto } from '../dtos/UpdateUserDto';
import { editFileName, imageFileFilter } from 'src/utils/file-upload.utils';
import { diskStorage } from 'multer';
@Controller('auth')
export class AuthController {

  private readonly logger = new Logger(AuthController.name);
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

  // @Post('/signup')
  // @UsePipes(new ValidationPipe())
  // async createUser(@Body() body: IUser) {
  //   try {
  //     const user = await this.authService.addUser(body);
  //     return user;
  //   } catch (error) {
  //     this.logger.error(`Error creating user: ${error.message}`, error.stack);

  //     if (error instanceof ApiError) {
  //       throw new HttpException(error.message, error.getStatus());
  //     }

  //     throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
  //   }
  // }

  @Post('/signup')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: editFileName,
      }),
      fileFilter: imageFileFilter,
    }),
  )
  @UsePipes(new ValidationPipe())
  async createUser(@UploadedFile() file, @Body() body: IUser) {
    try {
      const profilePict = file ? file.filename : null;
      const user = await this.authService.createUser(body, profilePict);
      return user;
    } catch (error) {
      if (error instanceof ApiError) {
        throw new HttpException(error.message, error.getStatus());
      }
      throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get(':id')
  @UsePipes(new ValidationPipe())
  async getUserDetails(@Param('id') id: number) {
    try {
      const user = await this.authService.getUserDetails(id);
      return user;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new HttpException(error.message, error.getStatus());
      }
      throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // @Put('/update/:id')
  // @UsePipes(new ValidationPipe())
  // async updateUser(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto) {
  //   try {
  //     const updatedUser = await this.authService.updateUser(id, updateUserDto);
  //     return updatedUser;
  //   } catch (error) {
  //     if (error instanceof NotFoundException) {
  //       throw new HttpException(error.message, error.getStatus());
  //     }
  //     throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
  //   }
  // }

  @Put('/update/:id')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: editFileName,
      }),
      fileFilter: imageFileFilter,
    }),
  )
  @UsePipes(new ValidationPipe())
  async updateUser(@Param('id') id: number, @UploadedFile() file, @Body() updateUserDto: UpdateUserDto) {
    try {
      const profilePict = file ? file.filename : null;
      const updatedUser = await this.authService.updateUser(id, updateUserDto, profilePict);
      return updatedUser;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new HttpException(error.message, error.getStatus());
      }
      throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
