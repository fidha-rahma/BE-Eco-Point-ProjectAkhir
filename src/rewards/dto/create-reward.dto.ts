import { IsInt, IsNotEmpty, IsString, Min, MaxLength } from 'class-validator';

export class CreateRewardDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(150)
    name: string;

    @IsInt()
    @Min(1)
    pointsRequired: number;

    @IsInt()
    @Min(0)
    stock: number;
}