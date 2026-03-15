import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Order } from '../../orders/entities/order.entity';

@Entity('payments')
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  payment_method: string; // e.g. 'Cash', 'Card', 'MFS'

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
