import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsInt,
  Min,
  Max,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class CreateCreditCardDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return parseFloat(value);
    }
    return value;
  })
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  limit: number;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(31)
  closingDay: number;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(31)
  dueDay: number;

  @IsString()
  @IsOptional()
  color?: string;
}
