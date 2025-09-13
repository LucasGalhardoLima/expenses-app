import { Test, TestingModule } from '@nestjs/testing';
import { TransactionsService } from './transactions.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { QueryTransactionDto } from './dto/query-transaction.dto';
import { TransactionType, Prisma } from '@prisma/client';

const mockPrismaService = {
  transaction: {
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    count: jest.fn(),
  },
};

describe('TransactionsService', () => {
  let service: TransactionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionsService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<TransactionsService>(TransactionsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a transaction', async () => {
      const createTransactionDto: CreateTransactionDto = {
        description: 'Grocery shopping',
        amount: '150.75',
        date: '2024-01-15',
        type: TransactionType.EXPENSE,
        categoryId: 'category1',
      };

      const expectedResult = {
        id: '1',
        description: 'Grocery shopping',
        amount: new Prisma.Decimal(150.75),
        date: new Date('2024-01-15'),
        type: TransactionType.EXPENSE,
        categoryId: 'category1',
        createdAt: new Date(),
        updatedAt: new Date(),
        category: {
          id: 'category1',
          name: 'Food',
          color: '#FF5733',
          type: TransactionType.EXPENSE,
        },
      };

      mockPrismaService.transaction.create.mockResolvedValue(expectedResult);

      const result = await service.create(createTransactionDto);

      expect(mockPrismaService.transaction.create).toHaveBeenCalledWith({
        data: {
          ...createTransactionDto,
          date: new Date(createTransactionDto.date),
          amount: new Prisma.Decimal(createTransactionDto.amount),
        },
        include: {
          category: true,
        },
      });
      expect(result).toEqual(expectedResult);
    });
  });

  describe('findAll', () => {
    it('should return paginated transactions without filters', async () => {
      const query: QueryTransactionDto = {};
      const expectedTransactions = [
        {
          id: '1',
          description: 'Grocery shopping',
          amount: new Prisma.Decimal(150.75),
          date: new Date('2024-01-15'),
          type: TransactionType.EXPENSE,
          categoryId: 'category1',
          category: { id: 'category1', name: 'Food' },
        },
      ];

      const totalCount = 1;

      mockPrismaService.transaction.count.mockResolvedValue(totalCount);
      mockPrismaService.transaction.findMany.mockResolvedValue(
        expectedTransactions,
      );

      const result = await service.findAll(query);

      expect(mockPrismaService.transaction.count).toHaveBeenCalledWith({
        where: {},
      });
      expect(mockPrismaService.transaction.findMany).toHaveBeenCalledWith({
        where: {},
        include: {
          category: true,
        },
        orderBy: {
          date: 'desc',
        },
        skip: 0,
        take: 20,
      });
      expect(result).toEqual({
        data: expectedTransactions,
        pagination: {
          page: 1,
          limit: 20,
          total: totalCount,
          totalPages: 1,
          hasNextPage: false,
          hasPreviousPage: false,
        },
      });
    });

    it('should return filtered transactions by type', async () => {
      const query: QueryTransactionDto = {
        type: TransactionType.EXPENSE,
        page: '2',
        limit: '10',
      };

      const expectedTransactions = [
        {
          id: '1',
          description: 'Grocery shopping',
          amount: new Prisma.Decimal(150.75),
          date: new Date('2024-01-15'),
          type: TransactionType.EXPENSE,
          categoryId: 'category1',
          category: { id: 'category1', name: 'Food' },
        },
      ];

      const totalCount = 25;

      mockPrismaService.transaction.count.mockResolvedValue(totalCount);
      mockPrismaService.transaction.findMany.mockResolvedValue(
        expectedTransactions,
      );

      const result = await service.findAll(query);

      expect(mockPrismaService.transaction.count).toHaveBeenCalledWith({
        where: { type: TransactionType.EXPENSE },
      });
      expect(mockPrismaService.transaction.findMany).toHaveBeenCalledWith({
        where: { type: TransactionType.EXPENSE },
        include: {
          category: true,
        },
        orderBy: {
          date: 'desc',
        },
        skip: 10,
        take: 10,
      });
      expect(result.pagination).toEqual({
        page: 2,
        limit: 10,
        total: 25,
        totalPages: 3,
        hasNextPage: true,
        hasPreviousPage: true,
      });
    });

    it('should return filtered transactions by month', async () => {
      const query: QueryTransactionDto = {
        month: '2024-01',
      };

      const expectedWhere = {
        date: {
          gte: new Date(2024, 0, 1),
          lte: new Date(2024, 1, 0, 23, 59, 59),
        },
      };

      mockPrismaService.transaction.count.mockResolvedValue(5);
      mockPrismaService.transaction.findMany.mockResolvedValue([]);

      await service.findAll(query);

      expect(mockPrismaService.transaction.count).toHaveBeenCalledWith({
        where: expectedWhere,
      });
      expect(mockPrismaService.transaction.findMany).toHaveBeenCalledWith({
        where: expectedWhere,
        include: {
          category: true,
        },
        orderBy: {
          date: 'desc',
        },
        skip: 0,
        take: 20,
      });
    });

    it('should return filtered transactions by date range', async () => {
      const query: QueryTransactionDto = {
        startDate: '2024-01-01',
        endDate: '2024-01-31',
      };

      const expectedWhere = {
        date: {
          gte: new Date('2024-01-01'),
          lte: new Date('2024-01-31'),
        },
      };

      mockPrismaService.transaction.count.mockResolvedValue(5);
      mockPrismaService.transaction.findMany.mockResolvedValue([]);

      await service.findAll(query);

      expect(mockPrismaService.transaction.count).toHaveBeenCalledWith({
        where: expectedWhere,
      });
      expect(mockPrismaService.transaction.findMany).toHaveBeenCalledWith({
        where: expectedWhere,
        include: {
          category: true,
        },
        orderBy: {
          date: 'desc',
        },
        skip: 0,
        take: 20,
      });
    });

    it('should return filtered transactions by categoryId', async () => {
      const query: QueryTransactionDto = {
        categoryId: 'category1',
      };

      const expectedWhere = {
        categoryId: 'category1',
      };

      mockPrismaService.transaction.count.mockResolvedValue(3);
      mockPrismaService.transaction.findMany.mockResolvedValue([]);

      await service.findAll(query);

      expect(mockPrismaService.transaction.count).toHaveBeenCalledWith({
        where: expectedWhere,
      });
      expect(mockPrismaService.transaction.findMany).toHaveBeenCalledWith({
        where: expectedWhere,
        include: {
          category: true,
        },
        orderBy: {
          date: 'desc',
        },
        skip: 0,
        take: 20,
      });
    });
  });

  describe('findOne', () => {
    it('should return a transaction by id', async () => {
      const id = '1';
      const expectedResult = {
        id,
        description: 'Grocery shopping',
        amount: new Prisma.Decimal(150.75),
        date: new Date('2024-01-15'),
        type: TransactionType.EXPENSE,
        categoryId: 'category1',
        createdAt: new Date(),
        updatedAt: new Date(),
        category: {
          id: 'category1',
          name: 'Food',
          color: '#FF5733',
          type: TransactionType.EXPENSE,
        },
      };

      mockPrismaService.transaction.findUnique.mockResolvedValue(
        expectedResult,
      );

      const result = await service.findOne(id);

      expect(mockPrismaService.transaction.findUnique).toHaveBeenCalledWith({
        where: { id },
        include: {
          category: true,
        },
      });
      expect(result).toEqual(expectedResult);
    });

    it('should return null when transaction not found', async () => {
      const id = 'non-existent';

      mockPrismaService.transaction.findUnique.mockResolvedValue(null);

      const result = await service.findOne(id);

      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    it('should update a transaction', async () => {
      const id = '1';
      const updateTransactionDto: UpdateTransactionDto = {
        description: 'Updated grocery shopping',
        amount: '175.5',
      };

      const expectedResult = {
        id,
        description: 'Updated grocery shopping',
        amount: new Prisma.Decimal(175.5),
        date: new Date('2024-01-15'),
        type: TransactionType.EXPENSE,
        categoryId: 'category1',
        createdAt: new Date(),
        updatedAt: new Date(),
        category: {
          id: 'category1',
          name: 'Food',
          color: '#FF5733',
          type: TransactionType.EXPENSE,
        },
      };

      mockPrismaService.transaction.update.mockResolvedValue(expectedResult);

      const result = await service.update(id, updateTransactionDto);

      expect(mockPrismaService.transaction.update).toHaveBeenCalledWith({
        where: { id },
        data: {
          description: updateTransactionDto.description,
          amount: new Prisma.Decimal(updateTransactionDto.amount!),
        },
        include: {
          category: true,
        },
      });
      expect(result).toEqual(expectedResult);
    });

    it('should update a transaction with date', async () => {
      const id = '1';
      const updateTransactionDto: UpdateTransactionDto = {
        description: 'Updated grocery shopping',
        date: '2024-01-20',
      };

      const expectedResult = {
        id,
        description: 'Updated grocery shopping',
        amount: new Prisma.Decimal(150.75),
        date: new Date('2024-01-20'),
        type: TransactionType.EXPENSE,
        categoryId: 'category1',
        createdAt: new Date(),
        updatedAt: new Date(),
        category: {
          id: 'category1',
          name: 'Food',
          color: '#FF5733',
          type: TransactionType.EXPENSE,
        },
      };

      mockPrismaService.transaction.update.mockResolvedValue(expectedResult);

      const result = await service.update(id, updateTransactionDto);

      expect(mockPrismaService.transaction.update).toHaveBeenCalledWith({
        where: { id },
        data: {
          description: updateTransactionDto.description,
          date: new Date(updateTransactionDto.date!),
        },
        include: {
          category: true,
        },
      });
      expect(result).toEqual(expectedResult);
    });
  });

  describe('remove', () => {
    it('should delete a transaction', async () => {
      const id = '1';
      const expectedResult = {
        id,
        description: 'Grocery shopping',
        amount: new Prisma.Decimal(150.75),
        date: new Date('2024-01-15'),
        type: TransactionType.EXPENSE,
        categoryId: 'category1',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.transaction.delete.mockResolvedValue(expectedResult);

      const result = await service.remove(id);

      expect(mockPrismaService.transaction.delete).toHaveBeenCalledWith({
        where: { id },
      });
      expect(result).toEqual(expectedResult);
    });
  });

  describe('getSummary', () => {
    it('should return transaction summary', async () => {
      const query: QueryTransactionDto = {
        month: '2024-01',
      };

      const expectedTransactions = [
        {
          type: TransactionType.EXPENSE,
          amount: new Prisma.Decimal(150.75),
          categoryId: 'category1',
          category: { name: 'Food', color: '#FF5733' },
        },
        {
          type: TransactionType.INCOME,
          amount: new Prisma.Decimal(3000),
          categoryId: 'category2',
          category: { name: 'Salary', color: '#33FF57' },
        },
      ];

      mockPrismaService.transaction.findMany.mockResolvedValue(
        expectedTransactions,
      );

      const result = await service.getSummary(query);

      expect(mockPrismaService.transaction.findMany).toHaveBeenCalledWith({
        where: {
          date: {
            gte: new Date(2024, 0, 1),
            lte: new Date(2024, 1, 0, 23, 59, 59),
          },
        },
        select: {
          type: true,
          amount: true,
          categoryId: true,
          category: {
            select: {
              id: true,
              name: true,
              color: true,
            },
          },
        },
      });

      expect(result.totalIncome).toBeDefined();
      expect(result.totalExpenses).toBeDefined();
      expect(result.balance).toBeDefined();
      expect(result.categoryBreakdown).toBeDefined();
    });
  });
});
