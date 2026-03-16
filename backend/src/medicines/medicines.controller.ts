import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { MedicinesService } from './medicines.service';
import { CreateMedicineDto } from './dto/create-medicine.dto';
import { UpdateMedicineDto } from './dto/update-medicine.dto';
import { GetMedicinesFilterDto } from './dto/get-medicines-filter.dto';

@Controller('medicines')
export class MedicinesController {
  constructor(private readonly medicinesService: MedicinesService) {}

  @Post()
  async create(@Body() createMedicineDto: CreateMedicineDto) {
    return this.medicinesService.create(createMedicineDto);
  }

  @Get()
  async findAll(@Query() filterDto: GetMedicinesFilterDto) {
    return this.medicinesService.findAll(filterDto);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.medicinesService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateMedicineDto: UpdateMedicineDto,
  ) {
    return this.medicinesService.update(id, updateMedicineDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.medicinesService.remove(id);
  }
}
