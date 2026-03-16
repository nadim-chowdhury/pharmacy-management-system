import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import { Customer } from 'src/customers/entities/customer.entity';
import { OrderItem } from './entities/order-item.entity';
import { Medicine } from 'src/medicines/entities/medicine.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    private readonly dataSource: DataSource,
  ) {}

  async create(createOrderDto: CreateOrderDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      let customer: Customer | undefined = undefined;
      if (createOrderDto.customerId) {
        customer = await queryRunner.manager.findOne(Customer, {
          where: {
            id: createOrderDto.customerId,
          },
        }) || undefined;

        if (!customer) {
          throw new NotFoundException('Customer not found');
        }
      }

      let calculatedSubTotal = 0;
      let calculatedDiscount = 0;
      const orderItems: OrderItem[] = [];

      for (const itemDto of createOrderDto.items) {
        const medicine = await queryRunner.manager.findOne(Medicine, {
          where: {
            id: itemDto.medicineId,
          },
          lock: { mode: 'pessimistic_write' },
        });

        if (!medicine) {
          throw new NotFoundException(
            `Medicine ID ${itemDto.medicineId} not found`,
          );
        }

        if (medicine.stock_quantity < itemDto.quantity) {
          throw new BadRequestException(
            `Insufficient stock for ${medicine.name}. Available: ${medicine.stock_quantity}, Requested: ${itemDto.quantity}`,
          );
        }

        const lineTotal = Number(medicine.price) * itemDto.quantity;
        const discountAmount =
          (lineTotal * Number(medicine.discount_percentage)) / 100;

        calculatedSubTotal += lineTotal;
        calculatedDiscount += discountAmount;

        medicine.stock_quantity -= itemDto.quantity;
        await queryRunner.manager.save(medicine);

        const orderItem = queryRunner.manager.create(OrderItem, {
          medicine: medicine,
          quantity: itemDto.quantity,
          unit_price: medicine.price,
        });
        orderItems.push(orderItem);
      }

      const order = queryRunner.manager.create(Order, {
        customer: customer,
        items: orderItems,
        subtotal: calculatedSubTotal,
        discount: calculatedDiscount,
        total_amount: calculatedSubTotal - calculatedDiscount,
      });

      const savedOrder = await queryRunner.manager.save(order);

      await queryRunner.commitTransaction();
      return savedOrder;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async findAll() {
    return this.orderRepository.find({
      relations: ['customer', 'items', 'items.medicine', 'payment'],
      order: {
        created_at: 'DESC',
      },
    });
  }

  async findOne(id: string) {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['customer', 'items', 'items.medicine', 'payment'],
    });

    if (!order) {
      throw new NotFoundException(`Order ID ${id} not found`);
    }

    return order;
  }

  async update(id: string, updateOrderDto: UpdateOrderDto) {
    const order = await this.findOne(id);

    const updateOrder = await this.orderRepository.preload({
      id: order.id,
      ...updateOrderDto,
    });

    if (!updateOrder) {
      throw new NotFoundException(`Order with ID ${id} not found for update`);
    }

    return this.orderRepository.save(updateOrder);
  }

  async remove(id: string) {
    const order = await this.findOne(id);
    return this.orderRepository.softRemove(order);
  }
}
