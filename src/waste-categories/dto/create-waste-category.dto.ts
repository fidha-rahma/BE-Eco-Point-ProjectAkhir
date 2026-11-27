import { IsInt, IsNotEmpty, IsString, Min, MaxLength } from 'class-validator';

export class CreateWasteCategoryDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    name: string;

    @IsInt()
    @Min(1)
    pointsPerKg: number;
}