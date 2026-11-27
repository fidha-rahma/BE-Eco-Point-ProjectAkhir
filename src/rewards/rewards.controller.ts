import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { RolesGuard } from '../common/guards/roles.guard.js';
import { UserRole } from '../common/enums/user-role.enum.js';
import { Roles } from '../common/decorators/roles.decorator.js';
import { CreateRewardDto } from './dto/create-reward.dto.js';
import { RewardsService } from './rewards.service.js';
import { UpdateRewardDto } from './dto/update-reward.dto.js';

@ApiTags('Rewards')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('rewards')
export class RewardsController {
    constructor(private service: RewardsService) { }

    @Post()
    @Roles(UserRole.ADMIN)
    create(@Body() dto: CreateRewardDto) { return this.service.create(dto); }

    @Get()
    findAll() { return this.service.findAll(); }

    @Get(':id')
    findOne(@Param('id') id: string) { return this.service.findOne(id); }

    @Patch(':id')
    @Roles(UserRole.ADMIN)
    update(
        @Param('id') id: string,
        @Body() dto: UpdateRewardDto,
    ) {
        return this.service.update(id, dto);
    }

    @Delete(':id')
    @Roles(UserRole.ADMIN)
    remove(@Param('id') id: string) { return this.service.remove(id); }
}