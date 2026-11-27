import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionsController } from './transactions.controller.js';
import { TransactionsService } from './transactions.service.js';
import { WasteTransaction } from './transaction.entity.js';
import { User } from '../users/user.entity.js';
import { WasteCategory } from '../waste-categories/waste-category.entity.js';


@Module({
    imports: [
        TypeOrmModule.forFeature([
            WasteTransaction, 
            User, 
            WasteCategory
        ])],
    controllers: [TransactionsController],
    providers: [TransactionsService],
})
export class TransactionsModule { }