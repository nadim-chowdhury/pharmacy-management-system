import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEmail,
  IsBoolean,
} from 'class-validator';

export class CreateCustomerDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsBoolean()
  @IsOptional()
  is_business?: boolean;
}
