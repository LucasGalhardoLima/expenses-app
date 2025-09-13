import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesService } from './categories.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { TransactionType } from '@prisma/client';

describe('CategoriesService', () => {
  let service: CategoriesService;

  const mockPrismaService = {
    category: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoriesService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<CategoriesService>(CategoriesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
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

      mockPrismaService.category.create.mockResolvedValue(expectedResult);

      const result = await service.create(createCategoryDto);

      expect(mockPrismaService.category.create).toHaveBeenCalledWith({
        data: createCategoryDto,
      });
      expect(result).toEqual(expectedResult);
    });

    it('should handle database errors', async () => {
      const createCategoryDto: CreateCategoryDto = {
        name: 'Food',
        color: '#FF5733',
        type: TransactionType.EXPENSE,
      };

      mockPrismaService.category.create.mockRejectedValue(
        new Error('Database error'),
      );

      await expect(service.create(createCategoryDto)).rejects.toThrow(
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

      mockPrismaService.category.findMany.mockResolvedValue(expectedResult);

      const result = await service.findAll();

      expect(mockPrismaService.category.findMany).toHaveBeenCalledWith({
        where: undefined,
        include: {
          transactions: {
            select: { id: true },
          },
        },
        orderBy: { name: 'asc' },
      });
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

      mockPrismaService.category.findMany.mockResolvedValue(expectedResult);

      const result = await service.findAll(TransactionType.EXPENSE);

      expect(mockPrismaService.category.findMany).toHaveBeenCalledWith({
        where: { type: TransactionType.EXPENSE },
        include: {
          transactions: {
            select: { id: true },
          },
        },
        orderBy: { name: 'asc' },
      });
      expect(result).toEqual(expectedResult);
    });

    it('should return empty array when no categories exist', async () => {
      mockPrismaService.category.findMany.mockResolvedValue([]);

      const result = await service.findAll();

      expect(result).toEqual([]);
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

      mockPrismaService.category.findUnique.mockResolvedValue(expectedResult);

      const result = await service.findOne(id);

      expect(mockPrismaService.category.findUnique).toHaveBeenCalledWith({
        where: { id },
        include: {
          transactions: {
            orderBy: { date: 'desc' },
            take: 10,
          },
        },
      });
      expect(result).toEqual(expectedResult);
    });

    it('should return null when category not found', async () => {
      const id = 'non-existent';

      mockPrismaService.category.findUnique.mockResolvedValue(null);

      const result = await service.findOne(id);

      expect(result).toBeNull();
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

      mockPrismaService.category.update.mockResolvedValue(expectedResult);

      const result = await service.update(id, updateCategoryDto);

      expect(mockPrismaService.category.update).toHaveBeenCalledWith({
        where: { id },
        data: updateCategoryDto,
      });
      expect(result).toEqual(expectedResult);
    });

    it('should handle update errors', async () => {
      const id = 'non-existent';
      const updateCategoryDto: UpdateCategoryDto = {
        name: 'Updated Food',
      };

      mockPrismaService.category.update.mockRejectedValue(
        new Error('Category not found'),
      );

      await expect(service.update(id, updateCategoryDto)).rejects.toThrow(
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

      mockPrismaService.category.delete.mockResolvedValue(expectedResult);

      const result = await service.remove(id);

      expect(mockPrismaService.category.delete).toHaveBeenCalledWith({
        where: { id },
      });
      expect(result).toEqual(expectedResult);
    });

    it('should handle removal errors', async () => {
      const id = 'non-existent';

      mockPrismaService.category.delete.mockRejectedValue(
        new Error('Category not found'),
      );

      await expect(service.remove(id)).rejects.toThrow('Category not found');
    });
  });
});
