import { Test, TestingModule } from '@nestjs/testing';
import { CreditCardsService } from './credit-cards.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCreditCardDto } from './dto/create-credit-card.dto';
import { UpdateCreditCardDto } from './dto/update-credit-card.dto';
import { CreateCreditCardTransactionDto } from './dto/create-credit-card-transaction.dto';
import { UpdateCreditCardTransactionDto } from './dto/update-credit-card-transaction.dto';

describe('CreditCardsService', () => {
  let service: CreditCardsService;

  const mockPrismaService = {
    creditCard: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    creditCardCategory: {
      findMany: jest.fn(),
    },
    creditCardTransaction: {
      create: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      aggregate: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreditCardsService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<CreditCardsService>(CreditCardsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('Credit Card operations', () => {
    describe('createCard', () => {
      it('should create a credit card', async () => {
        const createCardDto: CreateCreditCardDto = {
          name: 'Visa Gold',
          limit: 5000.0,
          closingDay: 15,
          dueDay: 10,
          color: '#1f2937',
        };

        const expectedResult = {
          id: '1',
          ...createCardDto,
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        mockPrismaService.creditCard.create.mockResolvedValue(expectedResult);

        const result = await service.createCard(createCardDto);

        expect(mockPrismaService.creditCard.create).toHaveBeenCalledWith({
          data: createCardDto,
        });
        expect(result).toEqual(expectedResult);
      });
    });

    describe('findAllCards', () => {
      it('should return all credit cards', async () => {
        const expectedResult = [
          {
            id: '1',
            name: 'Visa Gold',
            limit: 5000.0,
            closingDay: 15,
            dueDay: 10,
            color: '#1f2937',
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ];

        mockPrismaService.creditCard.findMany.mockResolvedValue(expectedResult);

        const result = await service.findAllCards();

        expect(mockPrismaService.creditCard.findMany).toHaveBeenCalledWith({
          include: {
            transactions: {
              include: {
                category: true,
              },
              orderBy: { date: 'desc' },
            },
          },
        });
        expect(result).toEqual(expectedResult);
      });
    });

    describe('findCardById', () => {
      it('should return a credit card by id', async () => {
        const id = '1';
        const expectedResult = {
          id,
          name: 'Visa Gold',
          limit: 5000.0,
          closingDay: 15,
          dueDay: 10,
          color: '#1f2937',
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        mockPrismaService.creditCard.findUnique.mockResolvedValue(
          expectedResult,
        );

        const result = await service.findCardById(id);

        expect(mockPrismaService.creditCard.findUnique).toHaveBeenCalledWith({
          where: { id },
          include: {
            transactions: {
              include: {
                category: true,
              },
              orderBy: { date: 'desc' },
            },
          },
        });
        expect(result).toEqual(expectedResult);
      });

      it('should return null when card not found', async () => {
        const id = 'non-existent';

        mockPrismaService.creditCard.findUnique.mockResolvedValue(null);

        const result = await service.findCardById(id);

        expect(result).toBeNull();
      });
    });

    describe('updateCard', () => {
      it('should update a credit card', async () => {
        const id = '1';
        const updateCardDto: UpdateCreditCardDto = {
          name: 'Updated Visa Gold',
          limit: 6000.0,
        };

        const expectedResult = {
          id,
          name: 'Updated Visa Gold',
          limit: 6000.0,
          closingDay: 15,
          dueDay: 10,
          color: '#1f2937',
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        mockPrismaService.creditCard.update.mockResolvedValue(expectedResult);

        const result = await service.updateCard(id, updateCardDto);

        expect(mockPrismaService.creditCard.update).toHaveBeenCalledWith({
          where: { id },
          data: updateCardDto,
        });
        expect(result).toEqual(expectedResult);
      });
    });

    describe('removeCard', () => {
      it('should remove a credit card', async () => {
        const id = '1';
        const expectedResult = {
          id,
          name: 'Visa Gold',
          limit: 5000.0,
          closingDay: 15,
          dueDay: 10,
          color: '#1f2937',
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        mockPrismaService.creditCard.delete.mockResolvedValue(expectedResult);

        const result = await service.removeCard(id);

        expect(mockPrismaService.creditCard.delete).toHaveBeenCalledWith({
          where: { id },
        });
        expect(result).toEqual(expectedResult);
      });
    });

    describe('findAllCategories', () => {
      it('should return all credit card categories', async () => {
        const expectedResult = [
          {
            id: '1',
            name: 'Shopping',
            color: '#ff5733',
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ];

        mockPrismaService.creditCardCategory.findMany.mockResolvedValue(
          expectedResult,
        );

        const result = await service.findAllCategories();

        expect(
          mockPrismaService.creditCardCategory.findMany,
        ).toHaveBeenCalledWith({
          orderBy: { name: 'asc' },
        });
        expect(result).toEqual(expectedResult);
      });
    });
  });

  describe('Credit Card Transaction operations', () => {
    describe('createTransaction', () => {
      it('should create a credit card transaction', async () => {
        const createTransactionDto: CreateCreditCardTransactionDto = {
          date: '2024-01-15',
          amount: 150.75,
          description: 'Shopping',
          installments: 3,
          categoryId: 'cat1',
          cardId: 'card1',
        };

        const expectedResult = {
          id: '1',
          date: new Date('2024-01-15'),
          amount: 150.75,
          description: 'Shopping',
          installments: 3,
          currentInstallment: 1,
          categoryId: 'cat1',
          cardId: 'card1',
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        mockPrismaService.creditCardTransaction.create.mockResolvedValue(
          expectedResult,
        );

        const result = await service.createTransaction(createTransactionDto);

        expect(
          mockPrismaService.creditCardTransaction.create,
        ).toHaveBeenCalledWith({
          data: {
            ...createTransactionDto,
            date: new Date(createTransactionDto.date),
          },
          include: {
            category: true,
            card: true,
          },
        });
        expect(result).toEqual(expectedResult);
      });
    });

    describe('findAllTransactions', () => {
      it('should return all transactions without filter', async () => {
        const expectedResult = [
          {
            id: '1',
            date: new Date('2024-01-15'),
            amount: 150.75,
            description: 'Shopping',
            installments: 3,
            currentInstallment: 1,
            categoryId: 'cat1',
            cardId: 'card1',
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ];

        mockPrismaService.creditCardTransaction.findMany.mockResolvedValue(
          expectedResult,
        );

        const result = await service.findAllTransactions();

        expect(
          mockPrismaService.creditCardTransaction.findMany,
        ).toHaveBeenCalledWith({
          where: undefined,
          include: {
            category: true,
            card: true,
          },
          orderBy: { date: 'desc' },
        });
        expect(result).toEqual(expectedResult);
      });

      it('should return filtered transactions by cardId', async () => {
        const cardId = 'card1';
        const expectedResult = [
          {
            id: '1',
            date: new Date('2024-01-15'),
            amount: 150.75,
            description: 'Shopping',
            installments: 3,
            currentInstallment: 1,
            categoryId: 'cat1',
            cardId,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ];

        mockPrismaService.creditCardTransaction.findMany.mockResolvedValue(
          expectedResult,
        );

        const result = await service.findAllTransactions(cardId);

        expect(
          mockPrismaService.creditCardTransaction.findMany,
        ).toHaveBeenCalledWith({
          where: { cardId },
          include: {
            category: true,
            card: true,
          },
          orderBy: { date: 'desc' },
        });
        expect(result).toEqual(expectedResult);
      });
    });

    describe('updateTransaction', () => {
      it('should update a credit card transaction', async () => {
        const id = '1';
        const updateTransactionDto: UpdateCreditCardTransactionDto = {
          amount: 200.0,
          description: 'Updated Shopping',
        };

        const expectedResult = {
          id,
          date: new Date('2024-01-15'),
          amount: 200.0,
          description: 'Updated Shopping',
          installments: 3,
          currentInstallment: 1,
          categoryId: 'cat1',
          cardId: 'card1',
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        mockPrismaService.creditCardTransaction.update.mockResolvedValue(
          expectedResult,
        );

        const result = await service.updateTransaction(
          id,
          updateTransactionDto,
        );

        expect(
          mockPrismaService.creditCardTransaction.update,
        ).toHaveBeenCalledWith({
          where: { id },
          data: updateTransactionDto,
          include: {
            category: true,
            card: true,
          },
        });
        expect(result).toEqual(expectedResult);
      });
    });

    describe('removeTransaction', () => {
      it('should remove a credit card transaction', async () => {
        const id = '1';
        const expectedResult = {
          id,
          date: new Date('2024-01-15'),
          amount: 150.75,
          description: 'Shopping',
          installments: 3,
          currentInstallment: 1,
          categoryId: 'cat1',
          cardId: 'card1',
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        mockPrismaService.creditCardTransaction.delete.mockResolvedValue(
          expectedResult,
        );

        const result = await service.removeTransaction(id);

        expect(
          mockPrismaService.creditCardTransaction.delete,
        ).toHaveBeenCalledWith({
          where: { id },
        });
        expect(result).toEqual(expectedResult);
      });
    });
  });
});
