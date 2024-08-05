import { HttpStatus, Injectable } from '@nestjs/common';
import { UserType } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { PrismaService } from 'src/prisma/prisma.service';
import { ApiError } from 'src/utils/apiError';

interface IUser {
  name: string;
  email: string;
  phone: string;
  password: string;
  type: UserType;
}

interface ILogin {
  email: string;
  password: string;
}
@Injectable()
export class AuthService {
  constructor(private readonly prismaService: PrismaService) {}
  private generateToken(id: number, email: string, type: string) {
    return jwt.sign({ user: id, email, type }, process.env.JWT_SECRET_KEY);
  }

  async addUser(body: IUser) {
    const isFound = await this.prismaService.user.findUnique({
      where: {
        email: body.email,
      },
    });
    if (isFound) {
      throw new ApiError(HttpStatus.CONFLICT, 'Email already in use');
    }
    const hashedPassword = await bcrypt.hash(body.password, 10);
    const user = await this.prismaService.user.create({
      data: { ...body, password: hashedPassword },
    });
    return user;
  }

  async login(body: ILogin) {
    const { email, password } = body;
    const isUserFound = await this.prismaService.user.findUnique({
      where: { email },
    });
    if (
      !isUserFound ||
      !(await bcrypt.compare(password, isUserFound.password))
    ) {
      throw new ApiError(HttpStatus.UNAUTHORIZED, 'Invalid credentials');
    }

    const { id, type } = isUserFound;
    const token = this.generateToken(id, email, type);
    return { user: isUserFound, token };
  }
}
