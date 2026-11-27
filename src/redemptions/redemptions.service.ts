import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Redemption } from './redemption.entity.js';
import { User } from '../users/user.entity.js';
import { Reward } from '../rewards/reward.entity.js';
import { CreateRedemptionDto } from './dto/create-redemption.dto.js';

@Injectable()
export class RedemptionsService {
    constructor(
        @InjectRepository(Redemption) private redemptions: Repository<Redemption>,
        @InjectRepository(User) private users: Repository<User>,
        @InjectRepository(Reward) private rewards: Repository<Reward>,
        @InjectDataSource() private dataSource: DataSource,
    ) { }

    async create(userId: string, dto: CreateRedemptionDto) {
        return this.dataSource.transaction(async (manager) => {
            const userRepo = manager.getRepository(User);
            const rewardRepo = manager.getRepository(Reward);
            const redemptionRepo = manager.getRepository(Redemption);

            const user = await userRepo.findOne({
                where: { id: userId },
                lock: { mode: 'pessimistic_write' },
            });
            if (!user) throw new NotFoundException('Pengguna tidak ditemukan');

            const reward = await rewardRepo.findOne({
                where: { id: dto.rewardId },
                lock: { mode: 'pessimistic_write' },
            });
            if (!reward) throw new NotFoundException('Hadiah tidak ditemukan');

            if (reward.stock < dto.quantity) {
                throw new BadRequestException('Stok hadiah tidak mencukupi');
            }

            const pointsSpent = reward.pointsRequired * dto.quantity;
            if (user.totalPoints < pointsSpent) {
                throw new BadRequestException('Poin tidak mencukupi');
            }

            user.totalPoints -= pointsSpent;
            reward.stock -= dto.quantity;

            await userRepo.save(user);
            await rewardRepo.save(reward);

            const redemption = redemptionRepo.create({
                user,
                reward,
                pointsSpent,
                quantity: dto.quantity,
            });
            const saved = await redemptionRepo.save(redemption);

            return {
                id: saved.id,
                rewardId: reward.id,
                rewardName: reward.name,
                quantity: saved.quantity,
                pointsSpent,
                remainingPoints: user.totalPoints,
                remainingStock: reward.stock,
                createdAt: saved.createdAt,
            };
        });
    }

    findMine(userId: string) {
        return this.redemptions.find({
            where: { user: { id: userId } },
            relations: { reward: true },
            order: { createdAt: 'DESC' },
        });
    }

    findAll() {
        return this.redemptions.find({
            relations: { user: true, reward: true },
            order: { createdAt: 'DESC' },
        });
    }
}