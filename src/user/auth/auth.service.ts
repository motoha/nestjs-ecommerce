import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { User, UserType } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { PrismaService } from 'src/prisma/prisma.service';
import { ApiError } from 'src/utils/apiError';
import { IUser } from 'src/utils/user.interface';
import { UpdateUserDto } from '../dtos/UpdateUserDto';

// interface IUser {
//   name: string;
//   email: string;
//   phone: string;
//   password: string;
//   type: UserType;
// }


@Injectable()
export class AuthService {
  constructor(private readonly prismaService: PrismaService) { this.checkEnvironmentVariables();}
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
  private checkEnvironmentVariables() {
    if (!process.env.JWT_SECRET_KEY) {
      throw new Error('JWT_ACCESS_SECRET is not defined in the environment variables');
    }
    if (!process.env.JWT_REFRESH_SECRET) {
      throw new Error('JWT_REFRESH_SECRET is not defined in the environment variables');
    }
  }

  private generateAccessToken(id: number, email: string, type: string): string {
    const secret = process.env.JWT_SECRET_KEY;
    if (!secret) {
      throw new Error('JWT_ACCESS_SECRET is not defined');
    }
    return jwt.sign(
      { user: id, email, type },
      secret,
      { expiresIn: '15m' }
    );
  }
  private generateRefreshToken(id: number): string {
    const secret = process.env.JWT_REFRESH_SECRET;
    if (!secret) {
      throw new Error('JWT_REFRESH_SECRET is not defined');
    }
    return jwt.sign(
      { user: id },
      secret,
      { expiresIn: '7d' }
    );
  }
  private async updateRefreshToken(userId: number, refreshToken: string): Promise<void> {
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await this.prismaService.user.update({
      where: { id: userId },
      data: { refreshToken: hashedRefreshToken },
    });
  }

  private generateTokens(id: number, email: string, type: string): ITokens {
    const accessToken = this.generateAccessToken(id, email, type);
    const refreshToken = this.generateRefreshToken(id);
    return { accessToken, refreshToken };
  }
  async refreshTokens(userId: number, refreshToken: string): Promise<ITokens> {
    const user = await this.prismaService.user.findUnique({
      where: { id: userId },
    });

    if (!user || !user.refreshToken) {
      throw new HttpException(
        {
          status: HttpStatus.UNAUTHORIZED,
          error: 'Access Denied',
          message: 'Invalid refresh token',
        },
        HttpStatus.UNAUTHORIZED
      );
    }

    const refreshTokenMatches = await bcrypt.compare(refreshToken, user.refreshToken);
    if (!refreshTokenMatches) {
      throw new HttpException(
        {
          status: HttpStatus.UNAUTHORIZED,
          error: 'Access Denied',
          message: 'Invalid refresh token',
        },
        HttpStatus.UNAUTHORIZED
      );
    }

    const tokens = this.generateTokens(user.id, user.email, user.type);
    await this.updateRefreshToken(user.id, tokens.refreshToken);

    return tokens;
  }


  async login(body: ILogin): Promise<{ statusCode: number; user: any; tokens: ITokens }> {
    const { email, password } = body;
    const user = await this.prismaService.user.findUnique({
      where: { email },
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new HttpException(
        {
          status: HttpStatus.UNAUTHORIZED,
          error: 'Invalid credentials',
          message: 'Invalid email or password',
        },
        HttpStatus.UNAUTHORIZED
      );
    }

    const { id, type } = user;
    const tokens = this.generateTokens(id, email, type);
    await this.updateRefreshToken(id, tokens.refreshToken);

    const { password: _, refreshToken: __, ...userWithoutSensitiveInfo } = user;

    return {
      statusCode: HttpStatus.OK,
      user: userWithoutSensitiveInfo,
      tokens: tokens,
    };
  }


 
  async loginx(body: ILogin) {
    const { email, password } = body;
    const isUserFound = await this.prismaService.user.findUnique({
      where: { email },
    });
    if (
      !isUserFound ||
      !(await bcrypt.compare(password, isUserFound.password))
    ) {
      // throw new ApiError(HttpStatus.UNAUTHORIZED, 'Invalid credentials');
      throw new HttpException(
        {
          status: HttpStatus.UNAUTHORIZED,
          error: 'Invalid credentials',
          message: 'No user found with this email',
        },
        HttpStatus.UNAUTHORIZED
      );
    }

    const { id, type } = isUserFound;
    const token = this.generateToken(id, email, type);
    return {  statusCode: HttpStatus.OK,user: isUserFound, token };
  }
  async logout(userId: number): Promise<void> {
    await this.prismaService.user.update({
      where: { id: userId },
      data: { refreshToken: null },
    });
  }
  async createUser(body: IUser, profilePict: string): Promise<Omit<User, 'password'>> {
    const { email, password, ...userData } = body;

    // Check if the user with the same email already exists
    const isFound = await this.prismaService.user.findUnique({
      where: { email },
    });

    if (isFound) {
      throw new ApiError(HttpStatus.CONFLICT, 'Email already in use');
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user
    const user = await this.prismaService.user.create({
      data: {
        ...userData,
        email,
        password: hashedPassword,
        profilePict, // Include the profile picture URL
      },
    });

    // Exclude the password field from the response
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
  // async createUser(body: IUser): Promise<User> {
  //   const { email, password, ...userData } = body;

  //   // Check if the user with the same email already exists
  //   const isFound = await this.prismaService.user.findUnique({
  //     where: { email },
  //   });

  //   if (isFound) {
  //     throw new ApiError(HttpStatus.CONFLICT, 'Email already in use');
  //   }

  //   // Hash the password
  //   const hashedPassword = await bcrypt.hash(password, 10);

  //   // Create the user
  //   const user = await this.prismaService.user.create({
  //     data: {
  //       ...userData,
  //       email,
  //       password: hashedPassword,
  //     },
  //   });

  //   return user;
  // }
  async getUserDetails(id: number): Promise<Omit<User, 'password'>> {
    try {
      // Retrieve the user by ID
      const user = await this.prismaService.user.findUnique({
        where: { id },
      });

      if (!user) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }

      // Exclude the password field from the response
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    } catch (error) {
      throw new Error(`Error retrieving user details: ${error.message}`);
    }
  }
  async updateUse2r(id: number, updateUserDto: UpdateUserDto): Promise<Omit<User, 'password'>> {
    try {
      // Check if the user exists
      const userExists = await this.prismaService.user.findUnique({
        where: { id },
      });

      if (!userExists) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }

      // Update the user
      const updatedUser = await this.prismaService.user.update({
        where: { id },
        data: updateUserDto,
      });

      // Exclude the password field from the response
      const { password, ...userWithoutPassword } = updatedUser;
      return userWithoutPassword;
    } catch (error) {
      throw new Error(`Error updating user: ${error.message}`);
    }
  }

  async updateUser(id: number, updateUserDto: UpdateUserDto, profilePict: string): Promise<Omit<User, 'password'>> {
    try {
      // Check if the user exists
      const userExists = await this.prismaService.user.findUnique({
        where: { id },
      });

      if (!userExists) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }

      // Update the user
      const updatedUser = await this.prismaService.user.update({
        where: { id },
        data: {
          ...updateUserDto,
          profilePict, // Include the profile picture URL
        },
      });

      // Exclude the password field from the response
      const { password, ...userWithoutPassword } = updatedUser;
      return userWithoutPassword;
    } catch (error) {
      throw new Error(`Error updating user: ${error.message}`);
    }
  }

  async findAll() {
    return this.prismaService.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        type: true,
        firstName: true,
        lastName: true,
        address: true,
        address_line1: true,
        address_line2: true,
        city: true,
        state: true,
        postal_code: true,
        country: true,
        profilePict: true,
        createdAt: true,
        updatedAt: true,
        
      },
    });
  }

}
