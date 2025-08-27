import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { QueryTransactionDto } from './dto/query-transaction.dto';
import { TransactionType, Prisma } from '@prisma/client';

@Injectable()
export class TransactionsService {
  constructor(private prisma: PrismaService) {}

  async create(createTransactionDto: CreateTransactionDto) {
    return this.prisma.transaction.create({
      data: {
        ...createTransactionDto,
        date: new Date(createTransactionDto.date),
        amount: new Prisma.Decimal(createTransactionDto.amount),
      },
      include: {
        category: true,
      },
    });
  }

  async findAll(query: QueryTransactionDto) {
    const where: Prisma.TransactionWhereInput = {};

    // Apply filters
    if (query.type) {
      where.type = query.type;
    }

    if (query.categoryId) {
      where.categoryId = query.categoryId;
    }

    // Handle date filtering
    if (query.month) {
      // Format: YYYY-MM
      const [year, month] = query.month.split('-').map(Number);
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0, 23, 59, 59);

      where.date = {
        gte: startDate,
        lte: endDate,
      };
    } else {
      if (query.startDate || query.endDate) {
        where.date = {};
        if (query.startDate) {
          where.date.gte = new Date(query.startDate);
        }
        if (query.endDate) {
          where.date.lte = new Date(query.endDate);
        }
      }
    }

    // Pagination parameters
    const page = query.page ? parseInt(query.page, 10) : 1;
    const limit = query.limit ? parseInt(query.limit, 10) : 20;
    const skip = (page - 1) * limit;

    // Get total count for pagination info
    const total = await this.prisma.transaction.count({ where });

    // Get transactions with pagination
    const transactions = await this.prisma.transaction.findMany({
      where,
      include: {
        category: true,
      },
      orderBy: {
        date: 'desc',
      },
      skip,
      take: limit,
    });

    return {
      data: transactions,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page < Math.ceil(total / limit),
        hasPreviousPage: page > 1,
      },
    };
  }

  async findOne(id: string) {
    return this.prisma.transaction.findUnique({
      where: { id },
      include: {
        category: true,
      },
    });
  }

  async update(id: string, updateTransactionDto: UpdateTransactionDto) {
    const data: any = { ...updateTransactionDto };

    if (updateTransactionDto.date) {
      data.date = new Date(updateTransactionDto.date);
    }

    if (updateTransactionDto.amount) {
      data.amount = new Prisma.Decimal(updateTransactionDto.amount);
    }

    return this.prisma.transaction.update({
      where: { id },
      data,
      include: {
        category: true,
      },
    });
  }

  async remove(id: string) {
    return this.prisma.transaction.delete({
      where: { id },
    });
  }

  async getSummary(query: QueryTransactionDto) {
    const where: Prisma.TransactionWhereInput = {};

    // Apply same filtering logic as findAll
    if (query.type) {
      where.type = query.type;
    }

    if (query.categoryId) {
      where.categoryId = query.categoryId;
    }

    if (query.month) {
      const [year, month] = query.month.split('-').map(Number);
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0, 23, 59, 59);

      where.date = {
        gte: startDate,
        lte: endDate,
      };
    } else {
      if (query.startDate || query.endDate) {
        where.date = {};
        if (query.startDate) {
          where.date.gte = new Date(query.startDate);
        }
        if (query.endDate) {
          where.date.lte = new Date(query.endDate);
        }
      }
    }

    // Use a single optimized query with joins
    const summaryData = await this.prisma.transaction.findMany({
      where,
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

    // Process data in memory (much faster than multiple DB queries)
    let totalIncome = 0;
    let totalExpenses = 0;
    let incomeCount = 0;
    let expenseCount = 0;
    const categoryBreakdown = new Map();

    for (const transaction of summaryData) {
      const amount = Number(transaction.amount);

      if (transaction.type === TransactionType.INCOME) {
        totalIncome += amount;
        incomeCount++;
      } else {
        totalExpenses += amount;
        expenseCount++;
      }

      // Category breakdown
      const categoryId = transaction.categoryId;
      if (!categoryBreakdown.has(categoryId)) {
        categoryBreakdown.set(categoryId, {
          categoryId,
          category: transaction.category,
          _sum: { amount: 0 },
          _count: 0,
        });
      }

      const categoryData = categoryBreakdown.get(categoryId);
      categoryData._sum.amount += amount;
      categoryData._count++;
    }

    return {
      totalIncome,
      totalExpenses,
      balance: totalIncome - totalExpenses,
      incomeCount,
      expenseCount,
      categoryBreakdown: Array.from(categoryBreakdown.values()),
    };
  }
}
