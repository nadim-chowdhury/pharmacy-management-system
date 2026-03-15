import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsIn,
  Min,
  IsOptional,
} from 'class-validator';

export class CreatePaymentDto {
  @IsString()
  @IsNotEmpty()
  orderId: string;

  @IsString()
  @IsIn(['CASH', 'BANK_CARD', 'MFS'])
  paymentMethod: string;

  @IsNumber()
  @Min(0)
  amountTotal: number;

  @IsNumber()
  @Min(0)
  amountPaid: number;

  @IsNumber()
  @Min(0)
  changeDue: number;

  @IsString()
  @IsOptional()
  transactionId?: string;
}
