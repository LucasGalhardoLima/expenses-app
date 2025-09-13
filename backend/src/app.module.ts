import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { CategoriesModule } from './categories/categories.module';
import { TransactionsModule } from './transactions/transactions.module';
import { BudgetsModule } from './budgets/budgets.module';
import { CreditCardsModule } from './credit-cards/credit-cards.module';
import { HealthService } from './health/health.service';
import { KeepAliveService } from './health/keep-alive.service';

@Module({
  imports: [
    PrismaModule,
    CategoriesModule,
    TransactionsModule,
    BudgetsModule,
    CreditCardsModule,
  ],
  controllers: [AppController],
  providers: [AppService, HealthService, KeepAliveService],
})
export class AppModule {}
