import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { RolesGuard } from '../common/guards/roles.guard.js';
import { UserRole } from '../common/enums/user-role.enum.js';
import { Roles } from '../common/decorators/roles.decorator.js';
import { CreateWasteCategoryDto } from './dto/create-waste-category.dto.js';
import { WasteCategoriesService } from './waste-categories.service.js';
import { UpdateWasteCategoryDto } from './dto/update-waste-category.dto.js';

@ApiTags('Waste Categories')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('waste-categories')
export class WasteCategoriesController {
    wasteCategoriesService: any;
    constructor(private service: WasteCategoriesService) { }

    @Post()
    @Roles(UserRole.ADMIN)
    create(@Body() dto: CreateWasteCategoryDto) { return this.service.create(dto); }

    @Get()
    findAll() { return this.service.findAll(); }

    @Get(':id')
    findOne(@Param('id') id: string) { return this.service.findOne(id); }

    @Patch(':id')
    @Roles(UserRole.ADMIN)
    update(
        @Param('id') id: string,
        @Body() updateWasteCategoryDto: UpdateWasteCategoryDto,
    ) {
        return this.service.update(id, updateWasteCategoryDto);
    }

    @Delete(':id')
    @Roles(UserRole.ADMIN)
    remove(@Param('id') id: string) { return this.service.remove(id); }
}