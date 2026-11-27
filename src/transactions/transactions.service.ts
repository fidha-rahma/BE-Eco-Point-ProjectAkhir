import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { WasteTransaction } from './transaction.entity.js';
import { User } from '../users/user.entity.js';
import { WasteCategory } from '../waste-categories/waste-category.entity.js';
import { CreateTransactionDto } from './dto/create-transaction.dto.js';

@Injectable()
export class TransactionsService {
    constructor(
        @InjectRepository(WasteTransaction) private transactions: Repository<WasteTransaction>,
        @InjectRepository(User) private users: Repository<User>,
        @InjectRepository(WasteCategory) private categories: Repository<WasteCategory>,
        @InjectDataSource() private dataSource: DataSource,
    ) { }

    async create(dto: CreateTransactionDto) {
        const user = await this.users.findOne({ where: { id: dto.userId } });
        if (!user) throw new NotFoundException('Anggota tidak ditemukan');

        const category = await this.categories.findOne({ where: { id: dto.wasteCategoryId } });
        if (!category) throw new NotFoundException('Kategori sampah tidak ditemukan');

        const points = Math.floor(dto.weightKg * category.pointsPerKg);

        return this.dataSource.transaction(async (manager) => {
            const transaction = manager.create(WasteTransaction, {
                user,
                category,
                weightKg: dto.weightKg.toFixed(2),
                totalPointsEarned: points,
            });
            await manager.save(transaction);

            await manager.increment(User, { id: user.id }, 'totalPoints', points);
            return {
                id: transaction.id,
                userId: user.id,
                categoryId: category.id,
                weightKg: transaction.weightKg,
                totalPointsEarned: points,
                createdAt: transaction.createdAt,
            };
        });
    }

    findAll() {
        return this.transactions.find({
            relations: { user: true, category: true },
            select: {
                id: true, weightKg: true, totalPointsEarned: true, createdAt: true,
                user: { id: true, name: true, email: true },
                category: { id: true, name: true, pointsPerKg: true },
            },
            order: { createdAt: 'DESC' },
        });
    }

    async findOne(id: string) {
        const item = await this.transactions.findOne({
            where: { id },
            relations: { user: true, category: true },
        });
        if (!item) throw new NotFoundException('Transaksi tidak ditemukan');
        return item;
    }

    findMine(userId: string) {
        return this.transactions.find({
            where: { user: { id: userId } },
            relations: { category: true },
            order: { createdAt: 'DESC' },
        });
    }
}