import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Payment } from './entities/payment.entity';
import { Repository } from 'typeorm';
import { Order } from '../orders/entities/order.entity';
import { PaymentMethod, PaymentStatus } from './entities/payment.entity';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
  ) {}

  async create(createPaymentDto: CreatePaymentDto) {
    const order = await this.orderRepository.findOne({
      where: { id: createPaymentDto.orderId },
      relations: ['payment'],
    });

    if (!order) {
      throw new NotFoundException(
        `Order ID ${createPaymentDto.orderId} not found`,
      );
    }

    if (order.payment) {
      throw new BadRequestException('This order has already been paid.');
    }

    // Explicitly typed enums based on the DTO string.
    let selectedMethod: PaymentMethod;
    if (createPaymentDto.paymentMethod === 'BANK_CARD') {
      selectedMethod = PaymentMethod.CARD;
    } else {
      selectedMethod = createPaymentDto.paymentMethod as PaymentMethod;
    }

    // Explicitly derive change owed or amount due
    const totalAmount = Number(order.total_amount);
    const amountPaid = Number(createPaymentDto.amountPaid);
    
    let status: PaymentStatus = PaymentStatus.PAID;
    let changeReturned = 0;
    let amountDue = 0;

    if (amountPaid > totalAmount) {
      changeReturned = amountPaid - totalAmount;
    } else if (amountPaid < totalAmount) {
      amountDue = totalAmount - amountPaid;
      status = amountPaid > 0 ? PaymentStatus.PARTIAL : PaymentStatus.DUE;
    }

    const payment = this.paymentRepository.create({
      order: order,
      payment_method: selectedMethod,
      amount_paid: amountPaid,
      amount_due: amountDue,
      change_returned: changeReturned,
      status: status,
    });

    return this.paymentRepository.save(payment);
  }

  async findAll() {
    return this.paymentRepository.find({
      relations: ['order'],
      order: {
        created_at: 'DESC',
      },
    });
  }

  async findOne(id: string) {
    const payment = await this.paymentRepository.findOne({
      where: { id },
      relations: ['order'],
    });

    if (!payment) {
      throw new NotFoundException(`Payment ID ${id} not found`);
    }

    return payment;
  }

  async update(id: string, updatePaymentDto: UpdatePaymentDto) {
    const payment = await this.findOne(id);

    // Explicitly handle updating the payment_method if it's part of the update
    let updatedMethod = payment.payment_method;
    if (updatePaymentDto.paymentMethod) {
      if (updatePaymentDto.paymentMethod === 'BANK_CARD') {
        updatedMethod = PaymentMethod.CARD;
      } else {
        updatedMethod = updatePaymentDto.paymentMethod as PaymentMethod;
      }
    }

    const updatedPayment = await this.paymentRepository.preload({
      id: payment.id,
      ...updatePaymentDto,
      payment_method: updatedMethod,
    });

    if (!updatedPayment) {
      throw new NotFoundException(`Payment with ID ${id} not found for update`);
    }

    return this.paymentRepository.save(updatedPayment);
  }

  async remove(id: string) {
    const payment = await this.findOne(id);
    return this.paymentRepository.remove(payment);
  }
}
