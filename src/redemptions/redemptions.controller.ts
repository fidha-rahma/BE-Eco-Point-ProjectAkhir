import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserRole } from '../common/enums/user-role.enum.js';
import { Roles } from '../common/decorators/roles.decorator.js';
import { CurrentUser } from '../common/decorators/current-user.decorator.js';
import { CreateRedemptionDto } from './dto/create-redemption.dto.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { RolesGuard } from '../common/guards/roles.guard.js';
import { RedemptionsService } from './redemptions.service.js';

@ApiTags('Redemptions')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('redemptions')
export class RedemptionsController {
    constructor(private service: RedemptionsService) { }

    @Post()
    @Roles(UserRole.MEMBER)
    create(
        @CurrentUser() user: { id: string },
        @Body() dto: CreateRedemptionDto,
    ) {
        return this.service.create(user.id, dto);
    }

    @Get('my')
    @Roles(UserRole.MEMBER)
    findMine(@CurrentUser() user: { id: string }) {
        return this.service.findMine(user.id);
    }

    @Get()
    @Roles(UserRole.ADMIN)
    findAll() {
        return this.service.findAll();
    }
}