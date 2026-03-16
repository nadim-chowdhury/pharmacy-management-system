import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { MedicinesService } from './medicines.service';
import { CreateMedicineDto } from './dto/create-medicine.dto';
import { UpdateMedicineDto } from './dto/update-medicine.dto';
import { GetMedicinesFilterDto } from './dto/get-medicines-filter.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';

@ApiTags('Medicines')
@Controller('medicines')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class MedicinesController {
  constructor(private readonly medicinesService: MedicinesService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @ApiOperation({ summary: 'Create a new medicine' })
  @ApiResponse({ status: 201, description: 'The medicine has been successfully created.' })
  async create(@Body() createMedicineDto: CreateMedicineDto) {
    return this.medicinesService.create(createMedicineDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all medicines with optional filtering and pagination' })
  @ApiResponse({ status: 200, description: 'Return all filtered medicines.' })
  async findAll(@Query() filterDto: GetMedicinesFilterDto) {
    return this.medicinesService.findAll(filterDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific medicine by ID' })
  @ApiResponse({ status: 200, description: 'Return the medicine details.' })
  @ApiResponse({ status: 404, description: 'Medicine not found.' })
  async findOne(@Param('id') id: string) {
    return this.medicinesService.findOne(id);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @ApiOperation({ summary: 'Update a specific medicine' })
  @ApiResponse({ status: 200, description: 'The medicine has been successfully updated.' })
  @ApiResponse({ status: 404, description: 'Medicine not found.' })
  async update(
    @Param('id') id: string,
    @Body() updateMedicineDto: UpdateMedicineDto,
  ) {
    return this.medicinesService.update(id, updateMedicineDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Delete a specific medicine' })
  @ApiResponse({ status: 200, description: 'The medicine has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Medicine not found.' })
  async remove(@Param('id') id: string) {
    return this.medicinesService.remove(id);
  }
}
