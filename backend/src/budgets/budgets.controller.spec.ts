import { Test, TestingModule } from '@nestjs/testing';
import { BudgetsController } from './budgets.controller';
import { BudgetsService } from './budgets.service';
import { CreateBudgetDto } from './dto/create-budget.dto';
import { UpdateBudgetDto } from './dto/update-budget.dto';
import { BudgetType } from '@prisma/client';

describe('BudgetsController', () => {
  let controller: BudgetsController;

  const mockBudgetsService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findByMonth: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BudgetsController],
      providers: [
        {
          provide: BudgetsService,
          useValue: mockBudgetsService,
        },
      ],
    }).compile();

    controller = module.get<BudgetsController>(BudgetsController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a budget', async () => {
      const createBudgetDto: CreateBudgetDto = {
        month: '2024-01',
        amount: 1000.5,
        type: BudgetType.FIXED_AMOUNT,
      };

      const expectedResult = {
        id: '1',
        ...createBudgetDto,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockBudgetsService.create.mockResolvedValue(expectedResult);

      const result = await controller.create(createBudgetDto);

      expect(mockBudgetsService.create).toHaveBeenCalledWith(createBudgetDto);
      expect(result).toEqual(expectedResult);
    });

    it('should handle service errors', async () => {
      const createBudgetDto: CreateBudgetDto = {
        month: '2024-01',
        amount: 1000,
        type: BudgetType.FIXED_AMOUNT,
      };

      mockBudgetsService.create.mockRejectedValue(new Error('Database error'));

      await expect(controller.create(createBudgetDto)).rejects.toThrow(
        'Database error',
      );
    });
  });

  describe('findAll', () => {
    it('should return an array of budgets', async () => {
      const expectedResult = [
        {
          id: '1',
          month: '2024-01',
          amount: 1000,
          type: BudgetType.FIXED_AMOUNT,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockBudgetsService.findAll.mockResolvedValue(expectedResult);

      const result = await controller.findAll();

      expect(mockBudgetsService.findAll).toHaveBeenCalled();
      expect(result).toEqual(expectedResult);
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

      mockBudgetsService.findByMonth.mockResolvedValue(expectedResult);

      const result = await controller.findByMonth(month);

      expect(mockBudgetsService.findByMonth).toHaveBeenCalledWith(month);
      expect(result).toEqual(expectedResult);
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

      mockBudgetsService.update.mockResolvedValue(expectedResult);

      const result = await controller.update(month, updateBudgetDto);

      expect(mockBudgetsService.update).toHaveBeenCalledWith(
        month,
        updateBudgetDto,
      );
      expect(result).toEqual(expectedResult);
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

      mockBudgetsService.remove.mockResolvedValue(expectedResult);

      const result = await controller.remove(month, type);

      expect(mockBudgetsService.remove).toHaveBeenCalledWith(month, type);
      expect(result).toEqual(expectedResult);
    });
  });
});
