import { IsArray, IsNotEmpty, IsString } from 'class-validator';
import { Board } from 'src/board/entities/board.entity';
import {
  Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn
} from 'typeorm';

@Entity({
  name: 'list_orders',
})
export class ListOrder {
  @PrimaryGeneratedColumn({name: 'order_id'})
  orderId: number;

  @OneToOne(() => Board, (board) => board.listOrder, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'board_id' , referencedColumnName: 'id'})
  board: Board;

  @Column({ type: 'int', name: 'board_id' , unsigned: true })
  boardId: number;

  @IsNotEmpty()
  @Column({ type: 'json', name: 'list_order' })
  listOrder: number[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}