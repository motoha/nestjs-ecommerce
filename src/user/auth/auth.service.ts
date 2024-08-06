import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
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
}
