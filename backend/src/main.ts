import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { PrismaRetryInterceptor } from './common/prisma-retry.interceptor';

async function bootstrap() {
  try {
    console.log('🔄 Starting NestJS application...');
    console.log('📦 Node.js version:', process.version);
    console.log('🌍 Environment:', process.env.NODE_ENV || 'development');
    console.log('🔗 Database URL configured:', !!process.env.DATABASE_URL);

    const app = await NestFactory.create(AppModule);
    console.log('✅ NestJS application created successfully');

    // Enable CORS with more permissive settings
    app.enableCors({
      origin: [
        'http://localhost:3000',
        'http://localhost:3001',
        'http://localhost:3002',
        'http://localhost:3003',
        'http://localhost:5173',
        /\.railway\.app$/,
        /\.vercel\.app$/,
        'https://healthcheck.railway.app', // Railway healthcheck hostname
        'https://expensehub.dev',
        'https://www.expensehub.dev',
      ],
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
      credentials: true,
    });
    console.log('✅ CORS configured');

    // Global validation pipe
    app.useGlobalPipes(new ValidationPipe({ transform: true }));
    console.log('✅ Global validation pipe configured');

    // Global Prisma retry interceptor for database connection issues
    app.useGlobalInterceptors(new PrismaRetryInterceptor());
    console.log('✅ Prisma retry interceptor configured');

    const port = process.env.PORT ?? 3001;
    console.log('🚀 Starting server on port:', port);
    console.log(
      '📍 PORT environment variable:',
      process.env.PORT ? 'Set by Railway' : 'Using default (3001)',
    );

    await app.listen(port);

    console.log(`🚀 Server running on port ${port}`);
    console.log(
      `🏥 Health check available at: http://localhost:${port}/health`,
    );
    console.log(`📊 API available at: http://localhost:${port}/`);
  } catch (error) {
    console.error('❌ Failed to start application:', error);
    process.exit(1);
  }
}
bootstrap().catch((err) => console.error('Error starting server:', err));
