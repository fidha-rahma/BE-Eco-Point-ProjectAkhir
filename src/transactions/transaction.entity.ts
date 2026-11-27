import * as typeorm from 'typeorm';
import { User } from '../users/user.entity.js';
import { WasteCategory } from '../waste-categories/waste-category.entity.js';

@typeorm.Entity('waste_transactions')
export class WasteTransaction {
    @typeorm.PrimaryGeneratedColumn('uuid')
    id: string;

    @typeorm.ManyToOne(() => User, (user) => user.transactions, { nullable: false })
    @typeorm.JoinColumn({ name: 'user_id' })
    user:  typeorm.Relation<User>;

    @typeorm.ManyToOne(() => WasteCategory, (category) => category.transactions, { nullable: false })
    @typeorm.JoinColumn({ name: 'waste_category_id' })
    category: WasteCategory;

    @typeorm.Column({ name: 'weight_kg', type: 'numeric', precision: 10, scale: 2 })
    weightKg: string;

    @typeorm.Column({ name: 'total_points_earned', type: 'int' })
    totalPointsEarned: number;

    @typeorm.CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
}