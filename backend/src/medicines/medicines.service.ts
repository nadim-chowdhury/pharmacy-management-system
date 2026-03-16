import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Medicine } from './entities/medicine.entity';
import { CreateMedicineDto } from './dto/create-medicine.dto';
import { UpdateMedicineDto } from './dto/update-medicine.dto';
import {
  GetMedicinesFilterDto,
  MedicineFilterStatus,
} from './dto/get-medicines-filter.dto';

@Injectable()
export class MedicinesService {
  constructor(
    @InjectRepository(Medicine)
    private readonly medicineRepository: Repository<Medicine>,
  ) {}

  async create(createMedicineDto: CreateMedicineDto): Promise<Medicine> {
    const medicine = this.medicineRepository.create({
      name: createMedicineDto.name,
      generic_name: createMedicineDto.genericName,
      brand: createMedicineDto.brand,
      barcode: createMedicineDto.barcode,
      price: createMedicineDto.price,
      stock_quantity: createMedicineDto.stock,
      discount_percentage: createMedicineDto.discount || 0,
    });
    return this.medicineRepository.save(medicine);
  }

  async findAll(filterDto: GetMedicinesFilterDto) {
    const { search, status, page = 1, limit = 10 } = filterDto;
    const query = this.medicineRepository.createQueryBuilder('medicine');
    // 1. Handle Search (Name, Generic Name, Barcode)
    if (search) {
      query.andWhere(
        '(LOWER(medicine.name) LIKE LOWER(:search) OR LOWER(medicine.generic_name) LIKE LOWER(:search) OR medicine.barcode = :exactSearch)',
        { search: `%${search}%`, exactSearch: search },
      );
    }
    // 2. Handle Status Filters
    if (status) {
      if (status === MedicineFilterStatus.IN_STOCK) {
        query.andWhere('medicine.stock_quantity > 0');
      } else if (status === MedicineFilterStatus.OUT_OF_STOCK) {
        query.andWhere('medicine.stock_quantity <= 0');
      } else if (status === MedicineFilterStatus.DISCOUNT) {
        query.andWhere('medicine.discount_percentage > 0');
      }
    }
    // 3. Pagination
    query.skip((page - 1) * limit).take(limit);
    // 4. Execution
    const [data, total] = await query.getManyAndCount();
    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string): Promise<Medicine> {
    const medicine = await this.medicineRepository.findOne({ where: { id } });
    if (!medicine) {
      throw new NotFoundException(`Medicine with ID ${id} not found`);
    }
    return medicine;
  }

  async update(
    id: string,
    updateMedicineDto: UpdateMedicineDto,
  ): Promise<Medicine> {
    const medicine = await this.medicineRepository.preload({
      id: id,
      name: updateMedicineDto.name,
      generic_name: updateMedicineDto.genericName,
      brand: updateMedicineDto.brand,
      barcode: updateMedicineDto.barcode,
      price: updateMedicineDto.price,
      stock_quantity: updateMedicineDto.stock,
      discount_percentage: updateMedicineDto.discount,
    });
    if (!medicine) {
      throw new NotFoundException(`Medicine with ID ${id} not found`);
    }
    return this.medicineRepository.save(medicine);
  }

  async remove(id: string): Promise<Medicine> {
    const medicine = await this.findOne(id);
    return this.medicineRepository.remove(medicine);
  }
}
