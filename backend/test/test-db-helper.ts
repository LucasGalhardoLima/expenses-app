import { TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { PrismaService } from '../src/prisma/prisma.service';

export class TestDbHelper {
  private static app: INestApplication;
  private static prisma: PrismaService;

  static async setupApp(moduleBuilder: any): Promise<INestApplication> {
    const moduleFixture: TestingModule = await moduleBuilder.compile();

    TestDbHelper.app = moduleFixture.createNestApplication();
    TestDbHelper.prisma = TestDbHelper.app.get<PrismaService>(PrismaService);

    await TestDbHelper.app.init();
    return TestDbHelper.app;
  }

  static async cleanupDb(): Promise<void> {
    const tableNames = [
      'credit_card_transactions',
      'credit_card_categories',
      'credit_cards',
      'transactions',
      'categories',
      'budgets',
    ];

    try {
      for (const tableName of tableNames) {
        await TestDbHelper.prisma.$executeRawUnsafe(
          `DELETE FROM "${tableName}";`,
        );
      }
    } catch (error) {
      console.log('Error cleaning database:', error);
    }
  }

  static async closeApp(): Promise<void> {
    await TestDbHelper.prisma.$disconnect();
    await TestDbHelper.app.close();
  }

  static getPrisma(): PrismaService {
    return TestDbHelper.prisma;
  }

  static getApp(): INestApplication {
    return TestDbHelper.app;
  }
}
