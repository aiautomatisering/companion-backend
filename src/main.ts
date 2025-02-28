import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Extract API prefix from environment or default to 'api'
  const GLOBAL_PREFIX = process.env.GLOBAL_PREFIX || 'api';
  app.setGlobalPrefix(GLOBAL_PREFIX);

  // IMPORTANT: Register the raw body middleware for the webhook route.
  // If your webhook controller is defined at 'subscriptions/webhook', then the full route is '/api/subscriptions/webhook'.
  app.use(
    `/${GLOBAL_PREFIX}/subscriptions/webhook`,
    express.raw({ type: 'application/json' })
  );

  // Global Validation Pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    })
  );

  // Swagger Configuration
  const config = new DocumentBuilder()
    .setTitle('Companion Backend API')
    .setDescription('API documentation for the Companion Backend App')
    .setVersion('1.0')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'JWT'
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(`${GLOBAL_PREFIX}/docs`, app, document);

  // Enable CORS
  app.enableCors();

  // Start the application
  const PORT = process.env.PORT || 9000;

  await app.listen(PORT);
  console.log(
    `Application is running on: ${process.env.BASE_URL}:${PORT}/${GLOBAL_PREFIX}/docs`
  );
}

void bootstrap();
