import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateRewardDto } from './dto/create-reward.dto.js';
import { Reward } from './reward.entity.js';


@Injectable()
export class RewardsService {
    constructor(@InjectRepository(Reward) private repo: Repository<Reward>) { }

    create(dto: CreateRewardDto) {
        return this.repo.save(this.repo.create(dto));
    }

    findAll() {
        return this.repo.find({ order: { name: 'ASC' } });
    }

    async findOne(id: string) {
        const reward = await this.repo.findOne({ where: { id } });
        if (!reward) throw new NotFoundException('Hadiah tidak ditemukan');
        return reward;
    }

    async update(id: string, dto: Partial<CreateRewardDto>) {
        const reward = await this.findOne(id);
        Object.assign(reward, dto);
        return this.repo.save(reward);
    }

    async remove(id: string) {
        const reward = await this.findOne(id);
        await this.repo.remove(reward);
        return { message: 'Hadiah berhasil dihapus' };
    }
}