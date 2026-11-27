import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity.js';


@Injectable()
export class UsersService {
    constructor(@InjectRepository(User) private repo: Repository<User>) { }

    findAll() {
        return this.repo.find({
            select: { id: true, name: true, email: true, role: true, totalPoints: true, createdAt: true },
            order: { createdAt: 'DESC' },
        });
    }

    async findOne(id: string) {
        const user = await this.repo.findOne({
            where: { id },
            select: { id: true, name: true, email: true, role: true, totalPoints: true, createdAt: true },
        });
        if (!user) throw new NotFoundException('Pengguna tidak ditemukan');
        return user;
    }
}