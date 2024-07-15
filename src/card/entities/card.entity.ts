import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CardColor } from '../types/card-color.type';
import { Assignee } from 'src/assignee/entities/assignee.entity';

@Entity('cards')
export class Card {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unsigned: true })
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

  // @ManyToOne((type) => List, (list) => list.cards, { onDelete: 'CASCADE' })
  // list: List;

  // @OneToMany((type) => Comment, (comment) => comment.card)
  // comments: Comment[];

  @OneToMany((type) => Assignee, (assignee) => assignee.card)
  assignees?: Assignee[];
}
