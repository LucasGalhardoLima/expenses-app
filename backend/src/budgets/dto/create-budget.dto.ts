import { IsString, IsNotEmpty, IsNumber, IsIn } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { BudgetType } from '@prisma/client';

export class CreateBudgetDto {
  @IsString()
  @IsNotEmpty()
  month: string; // formato YYYY-MM

  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return parseFloat(value);
    }
    return value;
  })
  @Type(() => Number)
  @IsNumber()
  amount: number;

  @IsIn(['INCOME_BASED', 'FIXED_AMOUNT'])
  type: BudgetType;
}
