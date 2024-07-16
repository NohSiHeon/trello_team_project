import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CardColor } from '../types/card-color.type';
import { Assignee } from 'src/card/entities/assignee.entity';
import { List } from 'src/list/entities/list.entity';

@Entity('cards')
export class Card {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'list_id', unsigned: true, type: 'int' })
  listId: number;

  @Column()
  title: string;

  @Column({ nullable: true })
  description?: string;

  @Column({ nullable: true })
  dueDate?: Date;

  @Column({
    type: 'enum',
    nullable: true,
    enum: CardColor,
    default: CardColor.Green,
  })
  color?: CardColor;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => List, (list) => list.cards, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'list_id', referencedColumnName: 'listId' })
  list: List;

  // @OneToMany(() => Comment, (comment) => comment.card)
  // comments: Comment[];

  @OneToMany(() => Assignee, (assignee) => assignee.card)
  assignees?: Assignee[];
}
