import { HttpException } from '@nestjs/common';

export class ApiError extends HttpException {
  constructor(status: number, message: string) {
    super(message, status);
  }
}
