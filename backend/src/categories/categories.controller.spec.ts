import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { TransactionType } from '@prisma/client';

describe('CategoriesController', () => {
  let controller: CategoriesController;

  const mockCategoriesService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoriesController],
      providers: [
        {
          provide: CategoriesService,
          useValue: mockCategoriesService,
        },
      ],
    }).compile();

    controller = module.get<CategoriesController>(CategoriesController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a category', async () => {
      const createCategoryDto: CreateCategoryDto = {
        name: 'Food',
        color: '#FF5733',
        type: TransactionType.EXPENSE,
      };

      const expectedResult = {
        id: '1',
        ...createCategoryDto,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockCategoriesService.create.mockResolvedValue(expectedResult);

      const result = await controller.create(createCategoryDto);

      expect(mockCategoriesService.create).toHaveBeenCalledWith(
        createCategoryDto,
      );
      expect(result).toEqual(expectedResult);
    });

    it('should handle service errors', async () => {
      const createCategoryDto: CreateCategoryDto = {
        name: 'Food',
        color: '#FF5733',
        type: TransactionType.EXPENSE,
      };

      mockCategoriesService.create.mockRejectedValue(
        new Error('Database error'),
      );

      await expect(controller.create(createCategoryDto)).rejects.toThrow(
        'Database error',
      );
    });
  });

  describe('findAll', () => {
    it('should return all categories when no type filter is provided', async () => {
      const expectedResult = [
        {
          id: '1',
          name: 'Food',
          color: '#FF5733',
          type: TransactionType.EXPENSE,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: '2',
          name: 'Salary',
          color: '#33FF57',
          type: TransactionType.INCOME,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockCategoriesService.findAll.mockResolvedValue(expectedResult);

      const result = await controller.findAll();

      expect(mockCategoriesService.findAll).toHaveBeenCalledWith(undefined);
      expect(result).toEqual(expectedResult);
    });

    it('should return filtered categories when type is provided', async () => {
      const expectedResult = [
        {
          id: '1',
          name: 'Food',
          color: '#FF5733',
          type: TransactionType.EXPENSE,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockCategoriesService.findAll.mockResolvedValue(expectedResult);

      const result = await controller.findAll(TransactionType.EXPENSE);

      expect(mockCategoriesService.findAll).toHaveBeenCalledWith(
        TransactionType.EXPENSE,
      );
      expect(result).toEqual(expectedResult);
    });
  });

  describe('findOne', () => {
    it('should return a category by id', async () => {
      const id = '1';
      const expectedResult = {
        id,
        name: 'Food',
        color: '#FF5733',
        type: TransactionType.EXPENSE,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockCategoriesService.findOne.mockResolvedValue(expectedResult);

      const result = await controller.findOne(id);

      expect(mockCategoriesService.findOne).toHaveBeenCalledWith(id);
      expect(result).toEqual(expectedResult);
    });

    it('should handle not found errors', async () => {
      const id = 'non-existent';

      mockCategoriesService.findOne.mockRejectedValue(
        new Error('Category not found'),
      );

      await expect(controller.findOne(id)).rejects.toThrow(
        'Category not found',
      );
    });
  });

  describe('update', () => {
    it('should update a category', async () => {
      const id = '1';
      const updateCategoryDto: UpdateCategoryDto = {
        name: 'Updated Food',
        color: '#FF0000',
      };

      const expectedResult = {
        id,
        name: 'Updated Food',
        color: '#FF0000',
        type: TransactionType.EXPENSE,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockCategoriesService.update.mockResolvedValue(expectedResult);

      const result = await controller.update(id, updateCategoryDto);

      expect(mockCategoriesService.update).toHaveBeenCalledWith(
        id,
        updateCategoryDto,
      );
      expect(result).toEqual(expectedResult);
    });

    it('should handle update errors', async () => {
      const id = 'non-existent';
      const updateCategoryDto: UpdateCategoryDto = {
        name: 'Updated Food',
      };

      mockCategoriesService.update.mockRejectedValue(
        new Error('Category not found'),
      );

      await expect(controller.update(id, updateCategoryDto)).rejects.toThrow(
        'Category not found',
      );
    });
  });

  describe('remove', () => {
    it('should remove a category', async () => {
      const id = '1';
      const expectedResult = {
        id,
        name: 'Food',
        color: '#FF5733',
        type: TransactionType.EXPENSE,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockCategoriesService.remove.mockResolvedValue(expectedResult);

      const result = await controller.remove(id);

      expect(mockCategoriesService.remove).toHaveBeenCalledWith(id);
      expect(result).toEqual(expectedResult);
    });

    it('should handle removal errors', async () => {
      const id = 'non-existent';

      mockCategoriesService.remove.mockRejectedValue(
        new Error('Category not found'),
      );

      await expect(controller.remove(id)).rejects.toThrow('Category not found');
    });
  });
});
