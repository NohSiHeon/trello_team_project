import { IsNotEmpty, IsString } from 'class-validator';
import {
  Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn
} from 'typeorm';
import { CardOrder } from './cardOrder.entity';
import { Board } from 'src/board/entities/board.entity';

@Entity({
  name: 'lists',
})
export class List {
  @PrimaryGeneratedColumn({name: 'list_id'})
  listId: number;

  @ManyToOne(() => Board, (board) => board.list)
  @JoinColumn({ name: 'board_id' , referencedColumnName: 'id'})
  board: Board;

  @Column({ type: 'int', name: 'board_id' , unsigned: true})
  boardId: number;

  @IsString()
  @IsNotEmpty()
  @Column({ type: 'varchar', name: 'title' })
  title: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToOne(() => CardOrder, (cardOrder) => cardOrder.list)
  cardOrder: CardOrder;
}