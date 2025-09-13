import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { HealthService } from './health/health.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly healthService: HealthService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('health')
  async health() {
    const dbHealth = await this.healthService.checkHealth();

    return {
      status: dbHealth.status,
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      database: dbHealth,
      port: process.env.PORT || '3001',
      railway: {
        deploymentId: process.env.RAILWAY_DEPLOYMENT_ID || 'not-set',
        serviceId: process.env.RAILWAY_SERVICE_ID || 'not-set',
        projectId: process.env.RAILWAY_PROJECT_ID || 'not-set',
      },
      uptime: process.uptime(),
      memory: process.memoryUsage(),
    };
  }

  @Get('warmup')
  async warmup() {
    const success = await this.healthService.warmUp();
    return {
      success,
      message: success
        ? 'Database warmed up successfully'
        : 'Database warm up failed',
      timestamp: new Date().toISOString(),
    };
  }
}
