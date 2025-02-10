import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Extract API prefix from BASE_URL
  const GLOBAL_PREFIX = process.env.GLOBAL_PREFIX || 'api';
  app.setGlobalPrefix(GLOBAL_PREFIX);

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
