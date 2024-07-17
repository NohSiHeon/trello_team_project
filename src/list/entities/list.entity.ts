import { IsNotEmpty, IsString } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CardOrder } from './cardOrder.entity';
import { Board } from 'src/board/entities/board.entity';
import { Card } from 'src/card/entities/card.entity';

@Entity({
  name: 'lists',
})
export class List {
  @PrimaryGeneratedColumn({ name: 'list_id', unsigned: true, type: 'int' })
  listId: number;

  @ManyToOne(() => Board, (board) => board.list)
  @JoinColumn({ name: 'board_id', referencedColumnName: 'id' })
  board: Board;

  /**
   * 보드id
   * @example 1
   */
  @Column({ type: 'int', name: 'board_id', unsigned: true })
  boardId: number;

  /**
   * 리스트 명
   * @example Done
   */
  @IsString()
  @IsNotEmpty()
  @Column({ type: 'varchar', name: 'title' })
  title: string;

  /**
   * 리스트 순서
   * @example 0|000000:
   */
  @Column({ type: 'varchar', name: 'rank' })
  rank: string;  

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Card, (card) => card.list)
  cards: Card[];
}
