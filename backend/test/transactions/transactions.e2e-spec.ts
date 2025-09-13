import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../../src/app.module';
import { TestDbHelper } from '../test-db-helper';
import { TransactionType } from '@prisma/client';

describe('Transactions (e2e)', () => {
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

  describe('/transactions (POST)', () => {
    it('should create a transaction', async () => {
      // First create a category
      const categoryResponse = await request(app.getHttpServer())
        .post('/categories')
        .send({
          name: 'Food',
          color: '#FF5733',
          type: TransactionType.EXPENSE,
        })
        .expect(201);

      const createTransactionDto = {
        description: 'Grocery shopping',
        amount: '150.75',
        date: '2024-01-15',
        type: TransactionType.EXPENSE,
        categoryId: categoryResponse.body.id,
      };

      return request(app.getHttpServer())
        .post('/transactions')
        .send(createTransactionDto)
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body.description).toBe(createTransactionDto.description);
          expect(res.body.amount).toBe(createTransactionDto.amount);
          expect(res.body.type).toBe(createTransactionDto.type);
          expect(res.body.categoryId).toBe(createTransactionDto.categoryId);
          expect(res.body).toHaveProperty('category');
          expect(res.body.category.name).toBe('Food');
        });
    });

    it('should return 400 for invalid data', async () => {
      const invalidTransactionDto = {
        description: '', // Invalid: empty description
        amount: 'invalid', // Invalid: not a valid decimal
        type: 'INVALID_TYPE', // Invalid: not a valid transaction type
      };

      return request(app.getHttpServer())
        .post('/transactions')
        .send(invalidTransactionDto)
        .expect(400);
    });
  });

  describe('/transactions (GET)', () => {
    it('should return all transactions with pagination', async () => {
      // Create category and transaction first
      const categoryResponse = await request(app.getHttpServer())
        .post('/categories')
        .send({
          name: 'Food',
          color: '#FF5733',
          type: TransactionType.EXPENSE,
        });

      await request(app.getHttpServer()).post('/transactions').send({
        description: 'Grocery shopping',
        amount: '150.75',
        date: '2024-01-15',
        type: TransactionType.EXPENSE,
        categoryId: categoryResponse.body.id,
      });

      return request(app.getHttpServer())
        .get('/transactions')
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('data');
          expect(res.body).toHaveProperty('pagination');
          expect(Array.isArray(res.body.data)).toBe(true);
          expect(res.body.pagination).toHaveProperty('page');
          expect(res.body.pagination).toHaveProperty('limit');
          expect(res.body.pagination).toHaveProperty('total');
          expect(res.body.pagination).toHaveProperty('totalPages');
        });
    });

    it('should return filtered transactions by type', async () => {
      // Create categories and transactions
      const expenseCategoryResponse = await request(app.getHttpServer())
        .post('/categories')
        .send({
          name: 'Food',
          color: '#FF5733',
          type: TransactionType.EXPENSE,
        });

      const incomeCategoryResponse = await request(app.getHttpServer())
        .post('/categories')
        .send({
          name: 'Salary',
          color: '#33FF57',
          type: TransactionType.INCOME,
        });

      // Create expense transaction
      await request(app.getHttpServer()).post('/transactions').send({
        description: 'Grocery shopping',
        amount: '150.75',
        date: '2024-01-15',
        type: TransactionType.EXPENSE,
        categoryId: expenseCategoryResponse.body.id,
      });

      // Create income transaction
      await request(app.getHttpServer()).post('/transactions').send({
        description: 'Monthly salary',
        amount: '3000.00',
        date: '2024-01-01',
        type: TransactionType.INCOME,
        categoryId: incomeCategoryResponse.body.id,
      });

      return request(app.getHttpServer())
        .get('/transactions?type=EXPENSE')
        .expect(200)
        .expect((res) => {
          expect(res.body.data).toHaveLength(1);
          expect(res.body.data[0].type).toBe(TransactionType.EXPENSE);
        });
    });

    it('should return empty array when no transactions exist', async () => {
      return request(app.getHttpServer())
        .get('/transactions')
        .expect(200)
        .expect((res) => {
          expect(res.body.data).toEqual([]);
          expect(res.body.pagination.total).toBe(0);
        });
    });
  });

  describe('/transactions/:id (GET)', () => {
    it('should return a specific transaction', async () => {
      // Create category and transaction first
      const categoryResponse = await request(app.getHttpServer())
        .post('/categories')
        .send({
          name: 'Food',
          color: '#FF5733',
          type: TransactionType.EXPENSE,
        });

      const transactionResponse = await request(app.getHttpServer())
        .post('/transactions')
        .send({
          description: 'Grocery shopping',
          amount: '150.75',
          date: '2024-01-15',
          type: TransactionType.EXPENSE,
          categoryId: categoryResponse.body.id,
        });

      return request(app.getHttpServer())
        .get(`/transactions/${transactionResponse.body.id}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.id).toBe(transactionResponse.body.id);
          expect(res.body.description).toBe('Grocery shopping');
          expect(res.body).toHaveProperty('category');
        });
    });

    it('should return 404 when transaction not found', async () => {
      return request(app.getHttpServer())
        .get('/transactions/non-existent-id')
        .expect(404);
    });
  });

  describe('/transactions/:id (PATCH)', () => {
    it('should update a transaction', async () => {
      // Create category and transaction first
      const categoryResponse = await request(app.getHttpServer())
        .post('/categories')
        .send({
          name: 'Food',
          color: '#FF5733',
          type: TransactionType.EXPENSE,
        });

      const transactionResponse = await request(app.getHttpServer())
        .post('/transactions')
        .send({
          description: 'Grocery shopping',
          amount: '150.75',
          date: '2024-01-15',
          type: TransactionType.EXPENSE,
          categoryId: categoryResponse.body.id,
        });

      const updateDto = {
        description: 'Updated grocery shopping',
        amount: '175.50',
      };

      return request(app.getHttpServer())
        .patch(`/transactions/${transactionResponse.body.id}`)
        .send(updateDto)
        .expect(200)
        .expect((res) => {
          expect(res.body.description).toBe(updateDto.description);
          expect(res.body.amount).toBe(updateDto.amount);
        });
    });

    it('should return 404 when trying to update non-existent transaction', async () => {
      const updateDto = {
        description: 'Updated description',
      };

      return request(app.getHttpServer())
        .patch('/transactions/non-existent-id')
        .send(updateDto)
        .expect(404);
    });
  });

  describe('/transactions/:id (DELETE)', () => {
    it('should delete a transaction', async () => {
      // Create category and transaction first
      const categoryResponse = await request(app.getHttpServer())
        .post('/categories')
        .send({
          name: 'Food',
          color: '#FF5733',
          type: TransactionType.EXPENSE,
        });

      const transactionResponse = await request(app.getHttpServer())
        .post('/transactions')
        .send({
          description: 'Grocery shopping',
          amount: '150.75',
          date: '2024-01-15',
          type: TransactionType.EXPENSE,
          categoryId: categoryResponse.body.id,
        });

      return request(app.getHttpServer())
        .delete(`/transactions/${transactionResponse.body.id}`)
        .expect(200);
    });

    it('should return 404 when trying to delete non-existent transaction', async () => {
      return request(app.getHttpServer())
        .delete('/transactions/non-existent-id')
        .expect(404);
    });
  });

  describe('/transactions/summary (GET)', () => {
    it('should return transaction summary', async () => {
      // Create categories
      const expenseCategoryResponse = await request(app.getHttpServer())
        .post('/categories')
        .send({
          name: 'Food',
          color: '#FF5733',
          type: TransactionType.EXPENSE,
        });

      const incomeCategoryResponse = await request(app.getHttpServer())
        .post('/categories')
        .send({
          name: 'Salary',
          color: '#33FF57',
          type: TransactionType.INCOME,
        });

      // Create transactions
      await request(app.getHttpServer()).post('/transactions').send({
        description: 'Grocery shopping',
        amount: '150.75',
        date: '2024-01-15',
        type: TransactionType.EXPENSE,
        categoryId: expenseCategoryResponse.body.id,
      });

      await request(app.getHttpServer()).post('/transactions').send({
        description: 'Monthly salary',
        amount: '3000.00',
        date: '2024-01-01',
        type: TransactionType.INCOME,
        categoryId: incomeCategoryResponse.body.id,
      });

      return request(app.getHttpServer())
        .get('/transactions/summary?month=2024-01')
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('totalIncome');
          expect(res.body).toHaveProperty('totalExpenses');
          expect(res.body).toHaveProperty('balance');
          expect(res.body).toHaveProperty('incomeCount');
          expect(res.body).toHaveProperty('expenseCount');
          expect(res.body).toHaveProperty('categoryBreakdown');
          expect(Array.isArray(res.body.categoryBreakdown)).toBe(true);
        });
    });
  });
});
