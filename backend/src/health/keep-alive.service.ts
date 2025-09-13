import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { HealthService } from '../health/health.service';

@Injectable()
export class KeepAliveService implements OnModuleInit {
  private readonly logger = new Logger(KeepAliveService.name);
  private keepAliveInterval: NodeJS.Timeout | null = null;

  constructor(private healthService: HealthService) {}

  onModuleInit() {
    // Só ativa keep-alive em produção (Railway/Render)
    if (process.env.NODE_ENV === 'production') {
      this.startKeepAlive();
    }
  }

  private startKeepAlive() {
    const intervalMs = 10 * 60 * 1000; // 10 minutos
    
    this.keepAliveInterval = setInterval(() => {
      this.performKeepAlive();
    }, intervalMs);

    this.logger.log('🚀 Keep-alive service started (10min intervals)');
  }

  private performKeepAlive() {
    this.healthService
      .warmUp()
      .then(() => {
        this.logger.debug('🔥 Keep-alive ping successful');
      })
      .catch((error) => {
        const msg = error instanceof Error ? error.message : 'Unknown error';
        this.logger.warn('⚠️ Keep-alive ping failed:', msg);
      });
  }

  stopKeepAlive() {
    if (this.keepAliveInterval) {
      clearInterval(this.keepAliveInterval);
      this.keepAliveInterval = null;
      this.logger.log('⏹️ Keep-alive service stopped');
    }
  }

  // Método para fazer ping manual
  async ping(): Promise<{ status: string; timestamp: string }> {
    try {
      const healthResult = await this.healthService.checkHealth();
      return {
        status: healthResult.status,
        timestamp: new Date().toISOString(),
      };
    } catch {
      return {
        status: 'error',
        timestamp: new Date().toISOString(),
      };
    }
  }
}
