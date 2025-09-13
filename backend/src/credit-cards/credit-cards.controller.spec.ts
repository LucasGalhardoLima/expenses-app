import { Test, TestingModule } from '@nestjs/testing';
import { CreditCardsController } from './credit-cards.controller';
import { CreditCardsService } from './credit-cards.service';
import { CreateCreditCardDto } from './dto/create-credit-card.dto';
import { UpdateCreditCardDto } from './dto/update-credit-card.dto';
import { CreateCreditCardTransactionDto } from './dto/create-credit-card-transaction.dto';
import { UpdateCreditCardTransactionDto } from './dto/update-credit-card-transaction.dto';

describe('CreditCardsController', () => {
  let controller: CreditCardsController;

  const mockCreditCardsService = {
    createCard: jest.fn(),
    findAllCards: jest.fn(),
    getCardSummary: jest.fn(),
    getCardBill: jest.fn(),
    findAllCategories: jest.fn(),
    findCardById: jest.fn(),
    updateCard: jest.fn(),
    removeCard: jest.fn(),
    createTransaction: jest.fn(),
    findAllTransactions: jest.fn(),
    updateTransaction: jest.fn(),
    removeTransaction: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CreditCardsController],
      providers: [
        {
          provide: CreditCardsService,
          useValue: mockCreditCardsService,
        },
      ],
    }).compile();

    controller = module.get<CreditCardsController>(CreditCardsController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('Credit Card endpoints', () => {
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

        mockCreditCardsService.createCard.mockResolvedValue(expectedResult);

        const result = await controller.createCard(createCardDto);

        expect(mockCreditCardsService.createCard).toHaveBeenCalledWith(
          createCardDto,
        );
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

        mockCreditCardsService.findAllCards.mockResolvedValue(expectedResult);

        const result = await controller.findAllCards();

        expect(mockCreditCardsService.findAllCards).toHaveBeenCalled();
        expect(result).toEqual(expectedResult);
      });
    });

    describe('getCardSummary', () => {
      it('should return card summary without cardId filter', async () => {
        const expectedResult = {
          totalCards: 2,
          totalLimit: 10000,
          totalUsed: 3000,
        };

        mockCreditCardsService.getCardSummary.mockResolvedValue(expectedResult);

        const result = await controller.getCardSummary();

        expect(mockCreditCardsService.getCardSummary).toHaveBeenCalledWith(
          undefined,
        );
        expect(result).toEqual(expectedResult);
      });

      it('should return card summary with cardId filter', async () => {
        const cardId = '1';
        const expectedResult = {
          totalCards: 1,
          totalLimit: 5000,
          totalUsed: 1500,
        };

        mockCreditCardsService.getCardSummary.mockResolvedValue(expectedResult);

        const result = await controller.getCardSummary(cardId);

        expect(mockCreditCardsService.getCardSummary).toHaveBeenCalledWith(
          cardId,
        );
        expect(result).toEqual(expectedResult);
      });
    });

    describe('getCardBill', () => {
      it('should return card bill for specific month', async () => {
        const cardId = '1';
        const month = '2024-01';
        const expectedResult = {
          cardId,
          month,
          transactions: [],
          total: 0,
        };

        mockCreditCardsService.getCardBill.mockResolvedValue(expectedResult);

        const result = await controller.getCardBill(cardId, month);

        expect(mockCreditCardsService.getCardBill).toHaveBeenCalledWith(
          cardId,
          month,
        );
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

        mockCreditCardsService.findAllCategories.mockResolvedValue(
          expectedResult,
        );

        const result = await controller.findAllCategories();

        expect(mockCreditCardsService.findAllCategories).toHaveBeenCalled();
        expect(result).toEqual(expectedResult);
      });
    });

    describe('findCardById', () => {
      it('should return a specific card', async () => {
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

        mockCreditCardsService.findCardById.mockResolvedValue(expectedResult);

        const result = await controller.findCardById(id);

        expect(mockCreditCardsService.findCardById).toHaveBeenCalledWith(id);
        expect(result).toEqual(expectedResult);
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

        mockCreditCardsService.updateCard.mockResolvedValue(expectedResult);

        const result = await controller.updateCard(id, updateCardDto);

        expect(mockCreditCardsService.updateCard).toHaveBeenCalledWith(
          id,
          updateCardDto,
        );
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

        mockCreditCardsService.removeCard.mockResolvedValue(expectedResult);

        const result = await controller.removeCard(id);

        expect(mockCreditCardsService.removeCard).toHaveBeenCalledWith(id);
        expect(result).toEqual(expectedResult);
      });
    });
  });

  describe('Credit Card Transaction endpoints', () => {
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
          ...createTransactionDto,
          currentInstallment: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        mockCreditCardsService.createTransaction.mockResolvedValue(
          expectedResult,
        );

        const result = await controller.createTransaction(createTransactionDto);

        expect(mockCreditCardsService.createTransaction).toHaveBeenCalledWith(
          createTransactionDto,
        );
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

        mockCreditCardsService.findAllTransactions.mockResolvedValue(
          expectedResult,
        );

        const result = await controller.findAllTransactions();

        expect(mockCreditCardsService.findAllTransactions).toHaveBeenCalledWith(
          undefined,
        );
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

        mockCreditCardsService.findAllTransactions.mockResolvedValue(
          expectedResult,
        );

        const result = await controller.findAllTransactions(cardId);

        expect(mockCreditCardsService.findAllTransactions).toHaveBeenCalledWith(
          cardId,
        );
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

        mockCreditCardsService.updateTransaction.mockResolvedValue(
          expectedResult,
        );

        const result = await controller.updateTransaction(
          id,
          updateTransactionDto,
        );

        expect(mockCreditCardsService.updateTransaction).toHaveBeenCalledWith(
          id,
          updateTransactionDto,
        );
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

        mockCreditCardsService.removeTransaction.mockResolvedValue(
          expectedResult,
        );

        const result = await controller.removeTransaction(id);

        expect(mockCreditCardsService.removeTransaction).toHaveBeenCalledWith(
          id,
        );
        expect(result).toEqual(expectedResult);
      });
    });
  });
});
