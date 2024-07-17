import { IsNotEmpty } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { List } from './list.entity';

@Entity({
  name: 'card_orders',
})
export class CardOrder {
  @PrimaryGeneratedColumn({ name: 'order_id' })
  orderId: number;

  @OneToOne(() => List, (list) => list.cardOrder)
  @JoinColumn({ name: 'list_id' })
  list: List;

  @Column({ type: 'int', name: 'list_id', unsigned: true })
  listId: number;

  @IsNotEmpty()
  @Column({ type: 'json', name: 'card_order' })
  cardOrder: string[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
