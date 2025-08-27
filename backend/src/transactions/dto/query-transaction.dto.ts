import {
  IsDateString,
  IsEnum,
  IsOptional,
  IsString,
  IsNumberString,
} from 'class-validator';
import { TransactionType } from '@prisma/client';

export class QueryTransactionDto {
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @IsEnum(TransactionType)
  type?: TransactionType;

  @IsOptional()
  @IsString()
  categoryId?: string;

  @IsOptional()
  @IsString()
  month?: string; // Format: YYYY-MM

  @IsOptional()
  @IsNumberString()
  page?: string;

  @IsOptional()
  @IsNumberString()
  limit?: string;
}
