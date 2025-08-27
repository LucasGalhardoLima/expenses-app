import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { getDatabaseUrl } from '../config/database.config';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    // Garantir que a DATABASE_URL está disponível antes de conectar
    const databaseUrl = getDatabaseUrl();
    
    super({
      datasources: {
        db: {
          url: databaseUrl,
        },
      },
    });
  }

  async onModuleInit() {
    await this.connectWithRetry();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }

  private async connectWithRetry(retries = 3, delay = 1000) {
    for (let i = 0; i < retries; i++) {
      try {
        await this.$connect();
        console.log('✅ Database connected successfully');
        return;
      } catch (error) {
        console.log(
          `⚠️  Database connection attempt ${i + 1}/${retries} failed`,
        );
        if (i === retries - 1) {
          console.error(
            '❌ Database connection failed after all retries:',
            error,
          );
          throw error;
        }
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }
}
