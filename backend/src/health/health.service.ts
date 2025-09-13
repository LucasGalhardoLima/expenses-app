import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class HealthService {
  private readonly logger = new Logger(HealthService.name);

  constructor(private prisma: PrismaService) {}

  // Método público para health check manual
  async checkHealth() {
    try {
      const startTime = Date.now();
      await this.prisma.$queryRaw`SELECT 1`;
      const responseTime = Date.now() - startTime;
      
      return {
        status: 'healthy',
        database: 'connected',
        responseTime: `${responseTime}ms`,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        database: 'disconnected',
        error: error.message,
        timestamp: new Date().toISOString(),
      };
    }
  }

  // Warm up the database connection
  async warmUp() {
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      this.logger.log('🔥 Database connection warmed up');
      return true;
    } catch (error) {
      this.logger.warn('⚠️ Database warm up failed:', error.message);
      return false;
    }
  }
}
