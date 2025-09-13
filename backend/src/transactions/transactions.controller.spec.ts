import { Test, TestingModule } from '@nestjs/testing';
import { TransactionsController } from './transactions.controller';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { QueryTransactionDto } from './dto/query-transaction.dto';
import { TransactionType, Prisma } from '@prisma/client';

const mockTransactionsService = {
  create: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
  getSummary: jest.fn(),
};

describe('TransactionsController', () => {
  let controller: TransactionsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransactionsController],
      providers: [
        {
          provide: TransactionsService,
          useValue: mockTransactionsService,
        },
      ],
    }).compile();

    controller = module.get<TransactionsController>(TransactionsController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
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

      mockTransactionsService.create.mockResolvedValue(expectedResult);

      const result = await controller.create(createTransactionDto);

      expect(mockTransactionsService.create).toHaveBeenCalledWith(
        createTransactionDto,
      );
      expect(result).toEqual(expectedResult);
    });
  });

  describe('findAll', () => {
    it('should return all transactions with pagination', async () => {
      const query: QueryTransactionDto = {
        page: '1',
        limit: '20',
      };

      const expectedResult = {
        data: [
          {
            id: '1',
            description: 'Grocery shopping',
            amount: new Prisma.Decimal(150.75),
            date: new Date('2024-01-15'),
            type: TransactionType.EXPENSE,
            categoryId: 'category1',
            category: { id: 'category1', name: 'Food' },
          },
        ],
        pagination: {
          page: 1,
          limit: 20,
          total: 1,
          totalPages: 1,
          hasNextPage: false,
          hasPreviousPage: false,
        },
      };

      mockTransactionsService.findAll.mockResolvedValue(expectedResult);

      const result = await controller.findAll(query);

      expect(mockTransactionsService.findAll).toHaveBeenCalledWith(query);
      expect(result).toEqual(expectedResult);
    });

    it('should return filtered transactions', async () => {
      const query: QueryTransactionDto = {
        type: TransactionType.EXPENSE,
        month: '2024-01',
        categoryId: 'category1',
      };

      const expectedResult = {
        data: [],
        pagination: {
          page: 1,
          limit: 20,
          total: 0,
          totalPages: 0,
          hasNextPage: false,
          hasPreviousPage: false,
        },
      };

      mockTransactionsService.findAll.mockResolvedValue(expectedResult);

      const result = await controller.findAll(query);

      expect(mockTransactionsService.findAll).toHaveBeenCalledWith(query);
      expect(result).toEqual(expectedResult);
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

      mockTransactionsService.findOne.mockResolvedValue(expectedResult);

      const result = await controller.findOne(id);

      expect(mockTransactionsService.findOne).toHaveBeenCalledWith(id);
      expect(result).toEqual(expectedResult);
    });

    it('should return null when transaction not found', async () => {
      const id = 'non-existent';

      mockTransactionsService.findOne.mockResolvedValue(null);

      const result = await controller.findOne(id);

      expect(mockTransactionsService.findOne).toHaveBeenCalledWith(id);
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

      mockTransactionsService.update.mockResolvedValue(expectedResult);

      const result = await controller.update(id, updateTransactionDto);

      expect(mockTransactionsService.update).toHaveBeenCalledWith(
        id,
        updateTransactionDto,
      );
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

      mockTransactionsService.remove.mockResolvedValue(expectedResult);

      const result = await controller.remove(id);

      expect(mockTransactionsService.remove).toHaveBeenCalledWith(id);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('getSummary', () => {
    it('should return transaction summary', async () => {
      const query: QueryTransactionDto = {
        month: '2024-01',
      };

      const expectedResult = {
        totalIncome: 3000,
        totalExpenses: 1500,
        balance: 1500,
        incomeCount: 1,
        expenseCount: 10,
        categoryBreakdown: [
          {
            categoryId: 'category1',
            categoryName: 'Food',
            categoryColor: '#FF5733',
            totalAmount: 750,
            count: 5,
            percentage: 50,
          },
        ],
      };

      mockTransactionsService.getSummary.mockResolvedValue(expectedResult);

      const result = await controller.getSummary(query);

      expect(mockTransactionsService.getSummary).toHaveBeenCalledWith(query);
      expect(result).toEqual(expectedResult);
    });
  });
});
