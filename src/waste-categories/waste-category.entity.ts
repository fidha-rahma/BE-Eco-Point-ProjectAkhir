import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { WasteTransaction } from '../transactions/transaction.entity.js';

@Entity('waste_categories')
export class WasteCategory {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true, length: 100 })
    name: string;

    @Column({ name: 'points_per_kg', type: 'int' })
    pointsPerKg: number;

    @OneToMany(() => WasteTransaction, (transaction) => transaction.category)
    transactions: WasteTransaction[];
}