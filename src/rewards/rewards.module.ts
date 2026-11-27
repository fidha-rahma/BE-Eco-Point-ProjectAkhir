import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reward } from './reward.entity.js';
import { RewardsController } from './rewards.controller.js';
import { RewardsService } from './rewards.service.js';


@Module({
  imports: [TypeOrmModule.forFeature([Reward])],
  controllers: [RewardsController],
  providers: [RewardsService],
  exports: [RewardsService],
})
export class RewardsModule {}