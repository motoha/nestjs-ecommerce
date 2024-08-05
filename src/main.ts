import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { LoggingInterceptor } from './interceptors/logging.interceptor';
import { ErrorMiddleware } from './middlewares/error.middleware';

const bootstrap = async () => {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );


  app.enableCors({
    origin: 'http://localhost:3000', 
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // enable credentials (if your API uses cookies or authentication)
  });
  app.useGlobalInterceptors(new LoggingInterceptor());
  app.useGlobalFilters(new ErrorMiddleware());
  await app.listen(4000);
  console.log('app listening on port: 4000');
};

bootstrap();
