import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { BudgetsService } from './budgets.service';
import { CreateBudgetDto } from './dto/create-budget.dto';
import { UpdateBudgetDto } from './dto/update-budget.dto';

@Controller('budgets')
export class BudgetsController {
  constructor(private readonly budgetsService: BudgetsService) {}

  @Post()
  create(@Body() createBudgetDto: CreateBudgetDto) {
    return this.budgetsService.create(createBudgetDto);
  }

  @Get()
  findAll() {
    return this.budgetsService.findAll();
  }

  @Get(':month')
  findByMonth(@Param('month') month: string) {
    return this.budgetsService.findByMonth(month);
  }

  @Patch(':month')
  update(
    @Param('month') month: string,
    @Body() updateBudgetDto: UpdateBudgetDto,
  ) {
    return this.budgetsService.update(month, updateBudgetDto);
  }

  @Delete(':month/:type')
  remove(@Param('month') month: string, @Param('type') type: string) {
    return this.budgetsService.remove(month, type);
  }
}
