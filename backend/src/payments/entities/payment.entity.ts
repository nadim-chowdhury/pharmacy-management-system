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
  PAID = 'PAID',
  PARTIAL = 'PARTIAL',
  DUE = 'DUE',
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

  @Column({
    type: 'enum',
    enum: PaymentStatus,
    default: PaymentStatus.PAID,
  })
  status: PaymentStatus;

  @Column('decimal', { precision: 10, scale: 2 })
  amount_paid: number;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  amount_due: number;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  change_returned: number;

  @OneToOne(() => Order, (order) => order.payment)
  @JoinColumn()
  order: Order;

  @CreateDateColumn()
  created_at: Date;
}
