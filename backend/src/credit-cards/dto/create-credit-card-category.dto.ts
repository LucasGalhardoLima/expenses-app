import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateCreditCardCategoryDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  color?: string;
}
