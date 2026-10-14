import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Enable CORS
  app.enableCors({
    origin: true, // Allow all origins for dev/sandbox & Expo/Next.js
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: false,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Global exception filter
  app.useGlobalFilters(new AllExceptionsFilter());

  // Static files for document & image uploads
  app.useStaticAssets(join(process.cwd(), 'uploads'), {
    prefix: '/uploads/',
  });

  // Swagger OpenAPI Documentation
  const config = new DocumentBuilder()
    .setTitle('Renting App REST API')
    .setDescription(
      'Full-stack Vehicle Rental Marketplace API (Discover → Compare → Verify → Book → Rent → Return → Review)',
    )
    .setVersion('1.0.0')
    .addBearerAuth()
    .addTag('Authentication')
    .addTag('Users & Verification')
    .addTag('Providers')
    .addTag('Vehicles & Discovery')
    .addTag('Bookings')
    .addTag('Payments & Checkout')
    .addTag('Condition Reports (Handover & Return Evidence)')
    .addTag('Digital Rental Agreements')
    .addTag('Reviews & Ratings')
    .addTag('Disputes & Claims')
    .addTag('Locations (Cities & Hubs)')
    .addTag('In-App Notifications')
    .addTag('Admin Administration')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    customSiteTitle: 'Renting App API Docs',
  });

  const port = process.env.PORT || 4000;
  await app.listen(port);
  console.log(`🚀 Renting App Backend running on: http://localhost:${port}`);
  console.log(`📚 Swagger OpenAPI Documentation: http://localhost:${port}/api/docs`);
}

bootstrap();
