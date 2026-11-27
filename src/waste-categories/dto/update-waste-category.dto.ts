import { PartialType } from '@nestjs/mapped-types';
import { CreateWasteCategoryDto } from './create-waste-category.dto.js';

export class UpdateWasteCategoryDto extends PartialType(
    CreateWasteCategoryDto,
) { }