import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { envs } from './config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();

  app.setGlobalPrefix('api')

  app.useGlobalPipes(
    new ValidationPipe({
      transformOptions: {enableImplicitConversion: true}
    }))
  
  await app.listen(envs.port);
}
bootstrap();