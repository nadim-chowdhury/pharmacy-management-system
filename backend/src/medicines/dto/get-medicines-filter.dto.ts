import { IsOptional, IsString, IsEnum, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

export enum MedicineFilterStatus {
  ALL = 'ALL',
  IN_STOCK = 'IN_STOCK',
  OUT_OF_STOCK = 'OUT_OF_STOCK',
  DISCOUNT = 'DISCOUNT',
}

export class GetMedicinesFilterDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsEnum(MedicineFilterStatus)
  status?: MedicineFilterStatus;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 10;
}
