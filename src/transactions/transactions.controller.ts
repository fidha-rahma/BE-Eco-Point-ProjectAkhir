import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserRole } from '../common/enums/user-role.enum.js';
import { Roles } from '../common/decorators/roles.decorator.js';
import { CreateTransactionDto } from './dto/create-transaction.dto.js';
import { TransactionsService } from './transactions.service.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { RolesGuard } from '../common/guards/roles.guard.js';
import { CurrentUser } from '../common/decorators/current-user.decorator.js';

@ApiTags('Transactions')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('transactions')
export class TransactionsController {
  constructor(private service: TransactionsService) {}

  @Post()
  @Roles(UserRole.ADMIN)
  create(@Body() dto: CreateTransactionDto) { return this.service.create(dto); }

  @Get()
  @Roles(UserRole.ADMIN)
  findAll() { return this.service.findAll(); }

  @Get('my')
  @Roles(UserRole.MEMBER)
  findMine(@CurrentUser() user: { id: string }) { return this.service.findMine(user.id); }
  
  @Get(':id')
  @Roles(UserRole.ADMIN)
  findOne(@Param('id') id: string) { return this.service.findOne(id); }
}