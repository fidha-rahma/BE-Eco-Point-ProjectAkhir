import { IsUUID, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateTransactionDto {
    @IsUUID()
    userId: string;

    @IsUUID()
    wasteCategoryId: string;

    @Type(() => Number)
    @IsNumber({ maxDecimalPlaces: 2 })
    @Min(0.01)
    weightKg: number;
}