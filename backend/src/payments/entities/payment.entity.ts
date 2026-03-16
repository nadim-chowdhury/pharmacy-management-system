import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Order } from '../../orders/entities/order.entity';

export enum PaymentStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
}
export enum PaymentMethod {
  CASH = 'CASH',
  CARD = 'CARD',
  MFS = 'MFS',
}

@Entity('payments')
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: PaymentMethod })
  payment_method: PaymentMethod;

  @Column('decimal', { precision: 10, scale: 2 })
  amount_paid: number;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  change_returned: number;

  @OneToOne(() => Order, (order) => order.payment)
  @JoinColumn()
  order: Order;

  @CreateDateColumn()
  created_at: Date;
}
