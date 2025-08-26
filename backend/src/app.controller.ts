import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('health')
  health() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      database: process.env.DATABASE_URL ? 'configured' : 'missing',
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
}
