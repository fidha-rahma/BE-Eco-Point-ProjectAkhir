import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WasteCategory } from './waste-category.entity.js';
import { WasteCategoriesController } from './waste-categories.controller.js';
import { WasteCategoriesService } from './waste-categories.service.js';

@Module({
    imports: [TypeOrmModule.forFeature([WasteCategory])],
    controllers: [WasteCategoriesController],
    providers: [WasteCategoriesService],
    exports: [WasteCategoriesService],
})
export class WasteCategoriesModule { }