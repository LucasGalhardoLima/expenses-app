import { Test, TestingModule } from '@nestjs/testing';
import { BudgetsService } from './budgets.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBudgetDto } from './dto/create-budget.dto';
import { UpdateBudgetDto } from './dto/update-budget.dto';
import { BudgetType } from '@prisma/client';

describe('BudgetsService', () => {
  let service: BudgetsService;

  const mockPrismaService = {
    budget: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    transaction: {
      aggregate: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BudgetsService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<BudgetsService>(BudgetsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a budget with fixed amount', async () => {
      const createBudgetDto: CreateBudgetDto = {
        month: '2024-01',
        amount: 1000,
        type: BudgetType.FIXED_AMOUNT,
      };

      const expectedResult = {
        id: '1',
        ...createBudgetDto,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.budget.create.mockResolvedValue(expectedResult);

      const result = await service.create(createBudgetDto);

      expect(mockPrismaService.budget.create).toHaveBeenCalledWith({
        data: {
          ...createBudgetDto,
          amount: createBudgetDto.amount,
        },
      });
      expect(result).toEqual(expectedResult);
    });

    it('should create a budget with income-based amount', async () => {
      const createBudgetDto: CreateBudgetDto = {
        month: '2024-01',
        amount: 1000,
        type: BudgetType.INCOME_BASED,
      };

      const incomeAmount = 800;
      const expectedResult = {
        id: '1',
        ...createBudgetDto,
        amount: incomeAmount,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Mock the income calculation
      mockPrismaService.transaction.aggregate.mockResolvedValue({
        _sum: { amount: incomeAmount },
      });
      mockPrismaService.budget.create.mockResolvedValue(expectedResult);

      const result = await service.create(createBudgetDto);

      expect(mockPrismaService.budget.create).toHaveBeenCalledWith({
        data: {
          ...createBudgetDto,
          amount: incomeAmount,
        },
      });
      expect(result).toEqual(expectedResult);
    });

    it('should handle database errors', async () => {
      const createBudgetDto: CreateBudgetDto = {
        month: '2024-01',
        amount: 1000,
        type: BudgetType.FIXED_AMOUNT,
      };

      mockPrismaService.budget.create.mockRejectedValue(
        new Error('Database error'),
      );

      await expect(service.create(createBudgetDto)).rejects.toThrow(
        'Database error',
      );
    });
  });

  describe('findAll', () => {
    it('should return all budgets ordered by month desc', async () => {
      const expectedResult = [
        {
          id: '1',
          month: '2024-02',
          amount: 1500,
          type: BudgetType.FIXED_AMOUNT,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: '2',
          month: '2024-01',
          amount: 1000,
          type: BudgetType.INCOME_BASED,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockPrismaService.budget.findMany.mockResolvedValue(expectedResult);

      const result = await service.findAll();

      expect(mockPrismaService.budget.findMany).toHaveBeenCalledWith({
        orderBy: { month: 'desc' },
      });
      expect(result).toEqual(expectedResult);
    });

    it('should return empty array when no budgets exist', async () => {
      mockPrismaService.budget.findMany.mockResolvedValue([]);

      const result = await service.findAll();

      expect(result).toEqual([]);
    });
  });

  describe('findByMonth', () => {
    it('should return budget for specific month', async () => {
      const month = '2024-01';
      const expectedResult = {
        id: '1',
        month,
        amount: 1000,
        type: BudgetType.FIXED_AMOUNT,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.budget.findFirst.mockResolvedValue(expectedResult);

      const result = await service.findByMonth(month);

      expect(mockPrismaService.budget.findFirst).toHaveBeenCalledWith({
        where: { month },
      });
      expect(result).toEqual(expectedResult);
    });

    it('should return null when budget not found', async () => {
      const month = '2024-01';

      mockPrismaService.budget.findFirst.mockResolvedValue(null);

      const result = await service.findByMonth(month);

      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    it('should update a budget', async () => {
      const month = '2024-01';
      const updateBudgetDto: UpdateBudgetDto = {
        amount: 1500,
      };

      const expectedResult = {
        id: '1',
        month,
        amount: 1500,
        type: BudgetType.FIXED_AMOUNT,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const existingBudget = {
        id: '1',
        month,
        amount: 1000,
        type: BudgetType.FIXED_AMOUNT,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.budget.findFirst.mockResolvedValue(existingBudget);
      mockPrismaService.budget.update.mockResolvedValue(expectedResult);

      const result = await service.update(month, updateBudgetDto);

      expect(mockPrismaService.budget.update).toHaveBeenCalledWith({
        where: { month_type: { month, type: BudgetType.FIXED_AMOUNT } },
        data: updateBudgetDto,
      });
      expect(result).toEqual(expectedResult);
    });

    it('should handle update errors', async () => {
      const month = '2024-01';
      const updateBudgetDto: UpdateBudgetDto = {
        amount: 1500,
      };

      mockPrismaService.budget.update.mockRejectedValue(
        new Error('Budget not found'),
      );

      await expect(service.update(month, updateBudgetDto)).rejects.toThrow(
        'Budget not found',
      );
    });
  });

  describe('remove', () => {
    it('should remove a budget', async () => {
      const month = '2024-01';
      const type = 'FIXED_AMOUNT';

      const expectedResult = {
        id: '1',
        month,
        amount: 1000,
        type: BudgetType.FIXED_AMOUNT,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.budget.delete.mockResolvedValue(expectedResult);

      const result = await service.remove(month, type);

      expect(mockPrismaService.budget.delete).toHaveBeenCalledWith({
        where: {
          month_type: {
            month,
            type: BudgetType.FIXED_AMOUNT,
          },
        },
      });
      expect(result).toEqual(expectedResult);
    });

    it('should handle removal errors', async () => {
      const month = '2024-01';
      const type = 'FIXED_AMOUNT';

      mockPrismaService.budget.delete.mockRejectedValue(
        new Error('Budget not found'),
      );

      await expect(service.remove(month, type)).rejects.toThrow(
        'Budget not found',
      );
    });
  });
});
