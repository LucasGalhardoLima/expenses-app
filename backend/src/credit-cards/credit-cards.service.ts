import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCreditCardDto } from './dto/create-credit-card.dto';
import { UpdateCreditCardDto } from './dto/update-credit-card.dto';
import { CreateCreditCardTransactionDto } from './dto/create-credit-card-transaction.dto';
import { UpdateCreditCardTransactionDto } from './dto/update-credit-card-transaction.dto';

@Injectable()
export class CreditCardsService {
  constructor(private readonly prisma: PrismaService) {}

  // Credit Card CRUD
  async createCard(createCreditCardDto: CreateCreditCardDto) {
    return await this.prisma.creditCard.create({
      data: createCreditCardDto,
    });
  }

  async findAllCards() {
    return await this.prisma.creditCard.findMany({
      include: {
        transactions: {
          include: {
            category: true,
          },
          orderBy: { date: 'desc' },
        },
      },
    });
  }

  async findCardById(id: string) {
    return await this.prisma.creditCard.findUnique({
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
  }

  async updateCard(id: string, updateCreditCardDto: UpdateCreditCardDto) {
    return await this.prisma.creditCard.update({
      where: { id },
      data: updateCreditCardDto,
    });
  }

  async removeCard(id: string) {
    return await this.prisma.creditCard.delete({
      where: { id },
    });
  }

  // Credit Card Transaction CRUD
  async createTransaction(createTransactionDto: CreateCreditCardTransactionDto) {
    return await this.prisma.creditCardTransaction.create({
      data: {
        ...createTransactionDto,
        date: new Date(createTransactionDto.date),
      },
      include: {
        category: true,
        card: true,
      },
    });
  }

  async findAllTransactions(cardId?: string) {
    return await this.prisma.creditCardTransaction.findMany({
      where: cardId ? { cardId } : undefined,
      include: {
        category: true,
        card: true,
      },
      orderBy: { date: 'desc' },
    });
  }

  async updateTransaction(id: string, updateTransactionDto: UpdateCreditCardTransactionDto) {
    const data: any = { ...updateTransactionDto };
    if (updateTransactionDto.date) {
      data.date = new Date(updateTransactionDto.date);
    }

    return await this.prisma.creditCardTransaction.update({
      where: { id },
      data,
      include: {
        category: true,
        card: true,
      },
    });
  }

  async removeTransaction(id: string) {
    return await this.prisma.creditCardTransaction.delete({
      where: { id },
    });
  }

  // Credit Card Categories
  async findAllCategories() {
    return await this.prisma.creditCardCategory.findMany({
      orderBy: { name: 'asc' },
    });
  }

  // Summary for a specific card or all cards
  async getCardSummary(cardId?: string) {
    const transactions = await this.prisma.creditCardTransaction.findMany({
      where: cardId ? { cardId } : undefined,
      include: {
        category: true,
        card: true,
      },
    });

    let totalSpent = 0;
    const categoryBreakdown = new Map();
    const cardBreakdown = new Map();

    for (const transaction of transactions) {
      const amount = Number(transaction.amount);
      totalSpent += amount;

      // Category breakdown
      const categoryId = transaction.categoryId;
      if (!categoryBreakdown.has(categoryId)) {
        categoryBreakdown.set(categoryId, {
          categoryId,
          category: transaction.category,
          total: 0,
          count: 0,
        });
      }
      const categoryData = categoryBreakdown.get(categoryId);
      categoryData.total += amount;
      categoryData.count++;

      // Card breakdown (if not filtered by specific card)
      if (!cardId) {
        const cardKey = transaction.cardId;
        if (!cardBreakdown.has(cardKey)) {
          cardBreakdown.set(cardKey, {
            cardId: cardKey,
            card: transaction.card,
            total: 0,
            count: 0,
          });
        }
        const cardData = cardBreakdown.get(cardKey);
        cardData.total += amount;
        cardData.count++;
      }
    }

    return {
      totalSpent,
      transactionCount: transactions.length,
      categoryBreakdown: Array.from(categoryBreakdown.values()),
      cardBreakdown: Array.from(cardBreakdown.values()),
    };
  }

  // Get card bill for a specific month
  async getCardBill(cardId: string, month: string) {
    // Parse month (YYYY-MM format)
    const [year, monthNumber] = month.split('-').map(Number);
    const startDate = new Date(year, monthNumber - 1, 1);
    const endDate = new Date(year, monthNumber, 0); // Last day of the month

    const card = await this.prisma.creditCard.findUnique({
      where: { id: cardId },
    });

    if (!card) {
      throw new Error('Card not found');
    }

    const transactions = await this.prisma.creditCardTransaction.findMany({
      where: {
        cardId,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        category: true,
      },
      orderBy: { date: 'desc' },
    });

    const totalAmount = transactions.reduce((sum, transaction) => {
      return sum + Number(transaction.amount);
    }, 0);

    const usagePercentage = (totalAmount / Number(card.limit)) * 100;

    // Calculate due date for the month
    const dueDate = new Date(year, monthNumber - 1, Number(card.dueDay));
    if (dueDate < endDate) {
      dueDate.setMonth(dueDate.getMonth() + 1);
    }

    return {
      cardId: card.id,
      cardName: card.name,
      limit: Number(card.limit),
      totalAmount,
      usagePercentage,
      dueDate: dueDate.toISOString(),
      transactionCount: transactions.length,
      transactions: transactions.map((t) => ({
        ...t,
        amount: Number(t.amount),
      })),
    };
  }
}
