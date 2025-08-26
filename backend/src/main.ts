import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { PrismaRetryInterceptor } from './common/prisma-retry.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS with more permissive settings
  app.enableCors({
    origin: [
      'http://localhost:3000',
      'http://localhost:3001',
      'http://localhost:3002',
      'http://localhost:3003',
      'http://localhost:5173',
    ], // Added port 3002 for frontend
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    credentials: true,
  });

  // Global validation pipe
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  // Global Prisma retry interceptor for database connection issues
  app.useGlobalInterceptors(new PrismaRetryInterceptor());

  await app.listen(process.env.PORT ?? 3001);
  console.log(`🚀 Server running on port ${process.env.PORT ?? 3001}`);
}
bootstrap().catch((err) => console.error('Error starting server:', err));
