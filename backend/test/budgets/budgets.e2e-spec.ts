import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../../src/app.module';
import { TestDbHelper } from '../test-db-helper';
import { BudgetType } from '@prisma/client';

describe('Budgets (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleBuilder = Test.createTestingModule({
      imports: [AppModule],
    });

    app = await TestDbHelper.setupApp(moduleBuilder);
  });

  beforeEach(async () => {
    await TestDbHelper.cleanupDb();
  });

  afterAll(async () => {
    await TestDbHelper.closeApp();
  });

  describe('/budgets (POST)', () => {
    it('should create a budget with fixed amount', () => {
      const createBudgetDto = {
        month: '2024-01',
        amount: 1000.5,
        type: BudgetType.FIXED_AMOUNT,
      };

      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      return request(app.getHttpServer())
        .post('/budgets')
        .send(createBudgetDto)
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body.month).toBe(createBudgetDto.month);
          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
          expect(parseFloat(res.body.amount.toString())).toBe(
            createBudgetDto.amount,
          );
          expect(res.body.type).toBe(createBudgetDto.type);
        });
    });

    it('should return 400 for invalid data', () => {
      const invalidBudgetDto = {
        month: 'invalid-month',
        amount: 'not-a-number',
        type: 'INVALID_TYPE',
      };

      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      return request(app.getHttpServer())
        .post('/budgets')
        .send(invalidBudgetDto)
        .expect(400);
    });
  });

  describe('/budgets (GET)', () => {
    it('should return all budgets', async () => {
      const budget = {
        month: '2024-01',
        amount: 1000,
        type: BudgetType.FIXED_AMOUNT,
      };

      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      await request(app.getHttpServer())
        .post('/budgets')
        .send(budget)
        .expect(201);

      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      return request(app.getHttpServer())
        .get('/budgets')
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveLength(1);
          expect(res.body[0].month).toBe('2024-01');
        });
    });

    it('should return empty array when no budgets exist', () => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      return request(app.getHttpServer())
        .get('/budgets')
        .expect(200)
        .expect([]);
    });
  });

  describe('/budgets/:month (GET)', () => {
    it('should return budget for specific month', async () => {
      const createBudgetDto = {
        month: '2024-01',
        amount: 1000,
        type: BudgetType.FIXED_AMOUNT,
      };

      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      await request(app.getHttpServer())
        .post('/budgets')
        .send(createBudgetDto)
        .expect(201);

      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      return request(app.getHttpServer())
        .get('/budgets/2024-01')
        .expect(200)
        .expect((res) => {
          expect(res.body.month).toBe('2024-01');
          expect(res.body.type).toBe(BudgetType.FIXED_AMOUNT);
        });
    });
  });
});
