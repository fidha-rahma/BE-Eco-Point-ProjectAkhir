import * as typeorm from 'typeorm';
import { User } from '../users/user.entity.js';
import { Reward } from '../rewards/reward.entity.js';

@typeorm.Entity('redemptions')
export class Redemption {
    @typeorm.PrimaryGeneratedColumn('uuid')
    id: string;

    @typeorm.ManyToOne(() => User, (user) => user.redemptions, { nullable: false })
    @typeorm.JoinColumn({ name: 'user_id' })
    user:  typeorm.Relation<User>;

    @typeorm.ManyToOne(() => Reward, (reward) => reward.redemptions, { nullable: false })
    @typeorm.JoinColumn({ name: 'reward_id' })
    reward: Reward;

    @typeorm.Column({ name: 'points_spent', type: 'int' })
    pointsSpent: number;

    @typeorm.Column({ type: 'int' })
    quantity: number;

    @typeorm.CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
}