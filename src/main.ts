import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { LoggingInterceptor } from './interceptors/logging.interceptor';
import { ErrorMiddleware } from './middlewares/error.middleware';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as express from 'express';
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
  app.use('/uploads', express.static('uploads'));
  const config = new DocumentBuilder()
  .setTitle('My API')
  .setDescription('API description')
  .setVersion('1.0')
  .addTag('cats')
  .build();
const document = SwaggerModule.createDocument(app, config);
SwaggerModule.setup('api', app, document);

  app.enableCors({
    origin: ['http://localhost:4200', 'http://localhost:4300', 'http://localhost'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // enable credentials (if your API uses cookies or authentication)
  });
  app.useGlobalInterceptors(new LoggingInterceptor());
  app.useGlobalFilters(new ErrorMiddleware());
  await app.listen(4000);
  console.log('app listening on port: 4000');
};

bootstrap();
