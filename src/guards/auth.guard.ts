import {
  CanActivate,
  ExecutionContext,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import * as jwt from 'jsonwebtoken';
import { PrismaService } from 'src/prisma/prisma.service';
import { ApiError } from 'src/utils/apiError';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly prismaService: PrismaService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      throw new ApiError(HttpStatus.UNAUTHORIZED, 'Token is required');
    }

    // is token valid
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET_KEY,
    ) as jwt.JwtPayload;
    const { user, email, type } = decoded;
    const isUserFound = await this.prismaService.user.findUnique({
      where: { id: user, email },
    });
    if (!email || !isUserFound) {
      throw new ApiError(HttpStatus.UNAUTHORIZED, 'Invalid token');
    }

    // is allowed for this type of role
    const roles = this.reflector?.getAllAndOverride('roles', [
      context.getHandler(),
      context.getClass(),
    ]);
    if (roles?.length && !roles.includes(type)) {
      throw new ApiError(HttpStatus.FORBIDDEN, 'Not allowed');
    }

    req.user = decoded;
    return true;
  }
}
