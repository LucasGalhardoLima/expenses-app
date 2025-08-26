import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBudgetDto } from './dto/create-budget.dto';
import { UpdateBudgetDto } from './dto/update-budget.dto';
import { BudgetType } from '@prisma/client';

@Injectable()
export class BudgetsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createBudgetDto: CreateBudgetDto) {
    const amount =
      createBudgetDto.type === 'INCOME_BASED'
        ? await this.calculateIncomeAmount(createBudgetDto.month)
        : createBudgetDto.amount;

    return await this.prisma.budget.create({
      data: {
        ...createBudgetDto,
        amount,
      },
    });
  }

  async findAll() {
    return await this.prisma.budget.findMany({
      orderBy: { month: 'desc' },
    });
  }

  async findByMonth(month: string) {
    const budget = await this.prisma.budget.findFirst({
      where: { month },
    });

    if (budget?.type === 'INCOME_BASED') {
      return await this.recalculateIncomeBudget(month);
    }

    return budget;
  }

  async update(month: string, updateBudgetDto: UpdateBudgetDto) {
    const existingBudget = await this.prisma.budget.findFirst({
      where: { month },
    });

    if (!existingBudget) {
      throw new Error('Budget not found');
    }

    const isTypeChanging =
      updateBudgetDto.type && updateBudgetDto.type !== existingBudget.type;

    if (isTypeChanging) {
      return await this.recreateBudgetWithNewType(
        month,
        existingBudget,
        updateBudgetDto,
      );
    }

    return await this.prisma.budget.update({
      where: {
        month_type: {
          month,
          type: existingBudget.type,
        },
      },
      data: updateBudgetDto,
    });
  }

  async recalculateIncomeBudget(month: string) {
    const newAmount = await this.calculateIncomeAmount(month);

    return await this.prisma.budget.update({
      where: {
        month_type: {
          month,
          type: 'INCOME_BASED',
        },
      },
      data: { amount: newAmount },
    });
  }

  async remove(month: string, type: string) {
    return await this.prisma.budget.delete({
      where: {
        month_type: {
          month,
          type: type as BudgetType,
        },
      },
    });
  }

  private async calculateIncomeAmount(month: string): Promise<number> {
    const { startDate, endDate } = this.getMonthDateRange(month);

    const incomeTransactions = await this.prisma.transaction.aggregate({
      where: {
        date: {
          gte: startDate,
          lt: endDate,
        },
        type: 'INCOME',
      },
      _sum: {
        amount: true,
      },
    });

    return Number(incomeTransactions._sum.amount) || 0;
  }

  private async recreateBudgetWithNewType(
    month: string,
    existingBudget: any,
    updateBudgetDto: UpdateBudgetDto,
  ) {
    await this.prisma.budget.delete({
      where: {
        month_type: {
          month,
          type: existingBudget.type,
        },
      },
    });

    const amount =
      updateBudgetDto.type === 'INCOME_BASED'
        ? await this.calculateIncomeAmount(month)
        : (updateBudgetDto.amount ?? existingBudget.amount);

    return await this.prisma.budget.create({
      data: {
        month,
        amount,
        type: updateBudgetDto.type!,
      },
    });
  }

  private getMonthDateRange(month: string) {
    const startDate = new Date(`${month}-01T00:00:00.000Z`);
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + 1);

    return { startDate, endDate };
  }
}
