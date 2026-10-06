import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Allow Vue frontend to communicate with NestJS
  app.enableCors();

  // Enable validation for incoming request data
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, //If randomField isn't defined in your DTO, whitelist removes it.
      transform: true, //helps NestJS transform incoming values into the types defined by DTO.
    }),
  );

  // Use global exception filter
  app.useGlobalFilters(new HttpExceptionFilter());

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();