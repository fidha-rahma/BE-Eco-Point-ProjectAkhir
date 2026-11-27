import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module.js';
import { UsersModule } from './users/users.module.js';
import { WasteCategoriesModule } from './waste-categories/waste-categories.module.js';
import { TransactionsModule } from './transactions/transactions.module.js';
import { RewardsModule } from './rewards/rewards.module.js';
import { RedemptionsModule } from './redemptions/redemptions.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        url: config.get<string>('DATABASE_URL'),
        autoLoadEntities: true,
        synchronize: false,
        ssl: { rejectUnauthorized: false },
      }),
    }),
    AuthModule,
    UsersModule,
    WasteCategoriesModule,
    TransactionsModule,
    RewardsModule,
    RedemptionsModule,
  ],
})
export class AppModule { }