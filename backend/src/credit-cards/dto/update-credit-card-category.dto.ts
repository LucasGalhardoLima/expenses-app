import { PartialType } from '@nestjs/mapped-types';
import { CreateCreditCardCategoryDto } from './create-credit-card-category.dto';

export class UpdateCreditCardCategoryDto extends PartialType(
  CreateCreditCardCategoryDto,
) {}
