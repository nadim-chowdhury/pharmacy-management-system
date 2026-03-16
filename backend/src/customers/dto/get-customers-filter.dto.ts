import { IsOptional, IsString, IsInt, Min, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';

export enum CustomerSortBy {
  NAME = 'name',
  CREATED_AT = 'created_at',
}

export enum SortOrder {
  ASC = 'ASC',
  DESC = 'DESC',
}

export class GetCustomersFilterDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  is_business?: string;

  @IsOptional()
  @IsEnum(CustomerSortBy)
  sortBy?: CustomerSortBy = CustomerSortBy.CREATED_AT;

  @IsOptional()
  @IsEnum(SortOrder)
  sortOrder?: SortOrder = SortOrder.DESC;

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
