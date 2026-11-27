import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Redemption } from '../redemptions/redemption.entity.js';

@Entity('rewards')
export class Reward {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ length: 150 })
    name: string;

    @Column({ name: 'points_required', type: 'int' })
    pointsRequired: number;

    @Column({ type: 'int', default: 0 })
    stock: number;

    @OneToMany(() => Redemption, (redemption) => redemption.reward)
    redemptions: Redemption[];
}