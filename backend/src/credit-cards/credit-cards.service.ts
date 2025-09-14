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
  async createTransaction(
    createTransactionDto: CreateCreditCardTransactionDto,
  ) {
    try {
      console.log(
        'Creating credit card transaction with data:',
        createTransactionDto,
      );

      // Verificar se o cartão existe
      const card = await this.prisma.creditCard.findUnique({
        where: { id: createTransactionDto.cardId },
      });

      if (!card) {
        throw new Error(
          `Credit card with ID ${createTransactionDto.cardId} not found`,
        );
      }

      // Verificar se a categoria existe
      const category = await this.prisma.creditCardCategory.findUnique({
        where: { id: createTransactionDto.categoryId },
      });

      if (!category) {
        throw new Error(
          `Category with ID ${createTransactionDto.categoryId} not found`,
        );
      }

      const result = await this.prisma.creditCardTransaction.create({
        data: {
          ...createTransactionDto,
          date: new Date(createTransactionDto.date),
        },
        include: {
          category: true,
          card: true,
        },
      });

      console.log('Credit card transaction created successfully:', result.id);
      return result;
    } catch (error) {
      console.error('Error creating credit card transaction:', error);
      throw error;
    }
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

  async updateTransaction(
    id: string,
    updateTransactionDto: UpdateCreditCardTransactionDto,
  ) {
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

    // Buscar TODAS as transações do cartão para calcular o uso total do limite
    const allTransactions = await this.prisma.creditCardTransaction.findMany({
      where: { cardId },
      include: { category: true },
    });

    // Calcular o valor total usado no limite (todas as transações pendentes)
    let totalUsedLimit = 0;
    
    // Array para armazenar as transações que aparecem na fatura do mês
    const billTransactions: any[] = [];

    for (const transaction of allTransactions) {
      const transactionDate = new Date(transaction.date);
      const amount = Number(transaction.amount);
      
      // Se não é parcelada, adiciona ao limite total usado
      if (transaction.installments <= 1) {
        totalUsedLimit += amount;
        
        // Se a transação está no período da fatura, adiciona à lista
        if (transactionDate >= startDate && transactionDate <= endDate) {
          billTransactions.push({
            ...transaction,
            amount: amount,
          });
        }
      } else {
        // Para transações parceladas
        const installmentAmount = amount / transaction.installments;
        
        // Adiciona ao limite total usado (valor total da compra)
        totalUsedLimit += amount;
        
        // Calcular quais parcelas vencem no mês da fatura
        for (let i = 0; i < transaction.installments; i++) {
          const installmentDate = new Date(transactionDate);
          installmentDate.setMonth(installmentDate.getMonth() + i);
          
          // Se a parcela vence no mês da fatura, adiciona à lista
          if (
            installmentDate.getFullYear() === year &&
            installmentDate.getMonth() === monthNumber - 1
          ) {
            billTransactions.push({
              ...transaction,
              amount: installmentAmount,
              currentInstallment: i + 1,
              isInstallment: true,
              installmentDate: installmentDate,
            });
          }
        }
      }
    }

    // Ordenar transações da fatura por data
    billTransactions.sort((a, b) => {
      const dateA = a.isInstallment
        ? new Date(a.installmentDate as Date)
        : new Date(a.date as Date);
      const dateB = b.isInstallment
        ? new Date(b.installmentDate as Date)
        : new Date(b.date as Date);
      return dateB.getTime() - dateA.getTime();
    });

    // Calcular total da fatura (apenas as transações/parcelas do mês)
    const totalBillAmount = billTransactions.reduce((sum, transaction) => {
      return sum + transaction.amount;
    }, 0);

    // Calcular percentual de uso do limite baseado no total usado
    const usagePercentage = (totalUsedLimit / Number(card.limit)) * 100;

    // Calculate due date for the month
    const dueDate = new Date(year, monthNumber - 1, Number(card.dueDay));
    if (dueDate < endDate) {
      dueDate.setMonth(dueDate.getMonth() + 1);
    }

    return {
      cardId: card.id,
      cardName: card.name,
      limit: Number(card.limit),
      totalAmount: totalBillAmount,
      totalUsedLimit: totalUsedLimit,
      usagePercentage,
      dueDate: dueDate.toISOString(),
      transactionCount: billTransactions.length,
      transactions: billTransactions,
    };
  }
}
