import { IsString, IsNotEmpty, IsNumber, IsOptional, IsDateString, Min } from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class CreateCreditCardTransactionDto {
  @IsDateString()
  date: string;

  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return parseFloat(value);
    }
    return value;
  })
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  amount: number;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsNotEmpty()
  categoryId: string;

  @IsString()
  @IsNotEmpty()
  cardId: string;

  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @IsOptional()
  installments?: number;

  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @IsOptional()
  currentInstallment?: number;
}
