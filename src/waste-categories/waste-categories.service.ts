import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateWasteCategoryDto } from './dto/create-waste-category.dto.js';
import { WasteCategory } from './waste-category.entity.js';

@Injectable()
export class WasteCategoriesService {
    constructor(@InjectRepository(WasteCategory) private repo: Repository<WasteCategory>) { }

    async create(dto: CreateWasteCategoryDto) {
        const exists = await this.repo.findOne({ where: { name: dto.name } });
        if (exists) throw new ConflictException('Kategori sudah ada');
        return this.repo.save(this.repo.create(dto));
    }

    findAll() {
        return this.repo.find({ order: { name: 'ASC' } });
    }

    async findOne(id: string) {
        const item = await this.repo.findOne({ where: { id } });
        if (!item) throw new NotFoundException('Kategori tidak ditemukan');
        return item;
    }

    async update(id: string, dto: Partial<CreateWasteCategoryDto>) {
        const item = await this.findOne(id);
        Object.assign(item, dto);
        return this.repo.save(item);
    }

    async remove(id: string) {
        const item = await this.findOne(id);
        await this.repo.remove(item);
        return { message: 'Kategori berhasil dihapus' };
    }
}