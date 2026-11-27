import { IsInt, IsUUID, Min } from 'class-validator';

export class CreateRedemptionDto {
    @IsUUID()
    rewardId: string;

    @IsInt()
    @Min(1)
    quantity: number;
}