import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { JsonWebTokenError } from 'jsonwebtoken';

@Catch()
export class ErrorMiddleware implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    console.log('error', exception);
    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: any = 'Internal Server Error';

    if (exception instanceof BadRequestException) {
      status = exception.getStatus();
      const error = exception as any;

      if (error.response.message instanceof Array) {
        message = error.response.message[0];
      } else {
        message = error.response.message;
      }
    } else if (exception instanceof HttpException) {
      status = exception.getStatus();
      message = exception.getResponse();
      if (message instanceof Object) {
        message = message.message;
      }
    } else if (exception instanceof JsonWebTokenError) {
      status = HttpStatus.UNAUTHORIZED;
      message = 'Invalid token';
    }

    response.status(status).json({
      status,
      message,
    });
  }
}
