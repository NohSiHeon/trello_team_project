import { IsInt, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Card } from 'src/card/entities/card.entity';

import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'comments' })
export class Comment {
  @PrimaryGeneratedColumn({ unsigned: true })
  id: number;

  /**
   * 댓글 내용
   * @example "스케줄 확인하고 진행하겠습니다!"
   */
  @IsNotEmpty({ message: '내용을 입력해주세요' })
  @IsString()
  @Column()
  content: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne((type): typeof Card => Card, (card) => card.comments, {
    onDelete: 'CASCADE',
  })
  card: Card;

  // @ManyToOne((type): typeof Merber => Merber, (merber) => merber.comments, {
  //   onDelete: 'CASCADE',
  // })
  // merber: Merber;
}
