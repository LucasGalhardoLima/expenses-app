import { IsEnum, IsHexColor, IsNotEmpty, IsString } from 'class-validator';
import { TransactionType } from '@prisma/client';

export class CreateCategoryDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsHexColor()
  @IsNotEmpty()
  color: string;

  @IsEnum(TransactionType)
  @IsNotEmpty()
  type: TransactionType;
}
