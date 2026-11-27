import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Redemption } from './redemption.entity.js';
import { User } from '../users/user.entity.js';
import { Reward } from '../rewards/reward.entity.js';
import { RedemptionsService } from './redemptions.service.js';
import { RedemptionsController } from './redemptions.controller.js';


@Module({
  imports: [TypeOrmModule.forFeature([
    Redemption, 
    User, 
    Reward
])],
  controllers: [RedemptionsController],
  providers: [RedemptionsService],
})
export class RedemptionsModule {}