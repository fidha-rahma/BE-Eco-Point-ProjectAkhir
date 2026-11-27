import * as typeorm from 'typeorm';
import { UserRole } from '../common/enums/user-role.enum.js';
import { WasteTransaction } from '../transactions/transaction.entity.js';
import { Redemption } from '../redemptions/redemption.entity.js';

@typeorm.Entity('users')
export class User {
    @typeorm.PrimaryGeneratedColumn('uuid')
    id: string;

    @typeorm.Column({ length: 100 })
    name: string;

    @typeorm.Column({ unique: true, length: 150 })
    email: string;

    @typeorm.Column({ select: false })
    password: string;

    @typeorm.Column({ type: 'enum', enum: UserRole, default: UserRole.MEMBER })
    role: UserRole;

    @typeorm.Column({ name: 'total_points', type: 'int', default: 0 })
    totalPoints: number;

    @typeorm.OneToMany(() => WasteTransaction, (transaction) => transaction.user)
    transactions: typeorm.Relation<WasteTransaction[]>;

    @typeorm.OneToMany(() => Redemption, (redemption) => redemption.user)
    redemptions: typeorm.Relation<Redemption[]>;

    @typeorm.CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @typeorm.UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}