import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../../src/app.module';
import { TestDbHelper } from '../test-db-helper';
import { TransactionType } from '@prisma/client';

describe('Categories (e2e)', () => {
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

  describe('/categories (POST)', () => {
    it('should create a category', () => {
      const createCategoryDto = {
        name: 'Food',
        color: '#FF5733',
        type: TransactionType.EXPENSE,
      };

      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      return request(app.getHttpServer())
        .post('/categories')
        .send(createCategoryDto)
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body.name).toBe(createCategoryDto.name);
          expect(res.body.color).toBe(createCategoryDto.color);
          expect(res.body.type).toBe(createCategoryDto.type);
        });
    });

    it('should return 400 for invalid data', () => {
      const invalidCategoryDto = {
        name: '',
        color: 'invalid-color',
        type: 'INVALID_TYPE',
      };

      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      return request(app.getHttpServer())
        .post('/categories')
        .send(invalidCategoryDto)
        .expect(400);
    });

    it('should return 409 for duplicate category name', async () => {
      const createCategoryDto = {
        name: 'Food',
        color: '#FF5733',
        type: TransactionType.EXPENSE,
      };

      // Create first category
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      await request(app.getHttpServer())
        .post('/categories')
        .send(createCategoryDto)
        .expect(201);

      // Try to create duplicate
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      return request(app.getHttpServer())
        .post('/categories')
        .send(createCategoryDto)
        .expect(409);
    });
  });

  describe('/categories (GET)', () => {
    it('should return all categories', async () => {
      const categories = [
        {
          name: 'Food',
          color: '#FF5733',
          type: TransactionType.EXPENSE,
        },
        {
          name: 'Salary',
          color: '#33FF57',
          type: TransactionType.INCOME,
        },
      ];

      for (const category of categories) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        await request(app.getHttpServer())
          .post('/categories')
          .send(category)
          .expect(201);
      }

      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      return request(app.getHttpServer())
        .get('/categories')
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveLength(2);
          expect(res.body[0].name).toBe('Food'); // Should be ordered by name asc
          expect(res.body[1].name).toBe('Salary');
        });
    });

    it('should return filtered categories by type', async () => {
      const categories = [
        {
          name: 'Food',
          color: '#FF5733',
          type: TransactionType.EXPENSE,
        },
        {
          name: 'Salary',
          color: '#33FF57',
          type: TransactionType.INCOME,
        },
      ];

      for (const category of categories) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        await request(app.getHttpServer())
          .post('/categories')
          .send(category)
          .expect(201);
      }

      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      return request(app.getHttpServer())
        .get('/categories?type=EXPENSE')
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveLength(1);
          expect(res.body[0].name).toBe('Food');
          expect(res.body[0].type).toBe(TransactionType.EXPENSE);
        });
    });

    it('should return empty array when no categories exist', () => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      return request(app.getHttpServer())
        .get('/categories')
        .expect(200)
        .expect([]);
    });
  });

  describe('/categories/:id (GET)', () => {
    it('should return a specific category', async () => {
      const createCategoryDto = {
        name: 'Food',
        color: '#FF5733',
        type: TransactionType.EXPENSE,
      };

      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      const createResponse = await request(app.getHttpServer())
        .post('/categories')
        .send(createCategoryDto)
        .expect(201);

      const categoryId = createResponse.body.id;

      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      return request(app.getHttpServer())
        .get(`/categories/${categoryId}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.id).toBe(categoryId);
          expect(res.body.name).toBe(createCategoryDto.name);
          expect(res.body.color).toBe(createCategoryDto.color);
          expect(res.body.type).toBe(createCategoryDto.type);
        });
    });

    it('should return 404 when category not found', () => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      return request(app.getHttpServer())
        .get('/categories/non-existent-id')
        .expect(404);
    });
  });

  describe('/categories/:id (PATCH)', () => {
    it('should update a category', async () => {
      const createCategoryDto = {
        name: 'Food',
        color: '#FF5733',
        type: TransactionType.EXPENSE,
      };

      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      const createResponse = await request(app.getHttpServer())
        .post('/categories')
        .send(createCategoryDto)
        .expect(201);

      const categoryId = createResponse.body.id;
      const updateCategoryDto = {
        name: 'Updated Food',
        color: '#FF0000',
      };

      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      return request(app.getHttpServer())
        .patch(`/categories/${categoryId}`)
        .send(updateCategoryDto)
        .expect(200)
        .expect((res) => {
          expect(res.body.id).toBe(categoryId);
          expect(res.body.name).toBe(updateCategoryDto.name);
          expect(res.body.color).toBe(updateCategoryDto.color);
          expect(res.body.type).toBe(TransactionType.EXPENSE); // Should remain unchanged
        });
    });

    it('should return 404 when trying to update non-existent category', () => {
      const updateCategoryDto = {
        name: 'Updated Food',
      };

      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      return request(app.getHttpServer())
        .patch('/categories/non-existent-id')
        .send(updateCategoryDto)
        .expect(404);
    });
  });

  describe('/categories/:id (DELETE)', () => {
    it('should delete a category', async () => {
      const createCategoryDto = {
        name: 'Food',
        color: '#FF5733',
        type: TransactionType.EXPENSE,
      };

      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      const createResponse = await request(app.getHttpServer())
        .post('/categories')
        .send(createCategoryDto)
        .expect(201);

      const categoryId = createResponse.body.id;

      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      return request(app.getHttpServer())
        .delete(`/categories/${categoryId}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.id).toBe(categoryId);
          expect(res.body.name).toBe(createCategoryDto.name);
        });
    });

    it('should return 404 when trying to delete non-existent category', () => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      return request(app.getHttpServer())
        .delete('/categories/non-existent-id')
        .expect(404);
    });
  });
});
