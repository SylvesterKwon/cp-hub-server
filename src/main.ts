import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { ValidationPipe } from '@nestjs/common';
import { ValidationFailedException } from './common/exceptions/validation-failed.exception';
import { BaseExceptionFilter } from './common/filters/exception.filters';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Pipe config
  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: (validationErrors) =>
        new ValidationFailedException(validationErrors),
    }),
  );

  // Filter config
  app.useGlobalFilters(new BaseExceptionFilter());

  // CORS config
  app.enableCors({
    origin: ['http://localhost:3001'],
    methods: ['GET', 'POST'],
    credentials: true,
  });

  // Dayjs config
  dayjs.extend(utc);

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
