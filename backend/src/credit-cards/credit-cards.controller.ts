import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { CreditCardsService } from './credit-cards.service';
import { CreateCreditCardDto } from './dto/create-credit-card.dto';
import { UpdateCreditCardDto } from './dto/update-credit-card.dto';
import { CreateCreditCardTransactionDto } from './dto/create-credit-card-transaction.dto';
import { UpdateCreditCardTransactionDto } from './dto/update-credit-card-transaction.dto';

@Controller('credit-cards')
export class CreditCardsController {
  constructor(private readonly creditCardsService: CreditCardsService) {}

  // Credit Card endpoints
  @Post()
  createCard(@Body() createCreditCardDto: CreateCreditCardDto) {
    return this.creditCardsService.createCard(createCreditCardDto);
  }

  @Get()
  findAllCards() {
    return this.creditCardsService.findAllCards();
  }

  @Get('summary')
  getCardSummary(@Query('cardId') cardId?: string) {
    return this.creditCardsService.getCardSummary(cardId);
  }

  @Get(':cardId/bill/:month')
  getCardBill(
    @Param('cardId') cardId: string,
    @Param('month') month: string,
  ) {
    return this.creditCardsService.getCardBill(cardId, month);
  }

  @Get('categories')
  findAllCategories() {
    return this.creditCardsService.findAllCategories();
  }

  @Get(':id')
  findCardById(@Param('id') id: string) {
    return this.creditCardsService.findCardById(id);
  }

  @Patch(':id')
  updateCard(
    @Param('id') id: string,
    @Body() updateCreditCardDto: UpdateCreditCardDto,
  ) {
    return this.creditCardsService.updateCard(id, updateCreditCardDto);
  }

  @Delete(':id')
  removeCard(@Param('id') id: string) {
    return this.creditCardsService.removeCard(id);
  }

  // Credit Card Transaction endpoints
  @Post('transactions')
  createTransaction(
    @Body() createTransactionDto: CreateCreditCardTransactionDto,
  ) {
    return this.creditCardsService.createTransaction(createTransactionDto);
  }

  @Get('transactions/all')
  findAllTransactions(@Query('cardId') cardId?: string) {
    return this.creditCardsService.findAllTransactions(cardId);
  }

  @Patch('transactions/:id')
  updateTransaction(
    @Param('id') id: string,
    @Body() updateTransactionDto: UpdateCreditCardTransactionDto,
  ) {
    return this.creditCardsService.updateTransaction(id, updateTransactionDto);
  }

  @Delete('transactions/:id')
  removeTransaction(@Param('id') id: string) {
    return this.creditCardsService.removeTransaction(id);
  }
}
