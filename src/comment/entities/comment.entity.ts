import { IsInt, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Card } from 'src/card/entities/card.entity';
import { Member } from 'src/member/entites/member.entity';

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

<<<<<<< HEAD
  // @ManyToOne((type): typeof Card => Card, (card) => card.comments, {
  //   onDelete: 'CASCADE',
  // })
  // card: Card;

  // @ManyToOne((type): typeof User => User, (user) => user.comments, {
  //   onDelete: 'CASCADE',
  // })
  // user: User;
=======
  @ManyToOne((type): typeof Card => Card, (card) => card.comments, {
    onDelete: 'CASCADE',
  })
  card: Card;

  @ManyToOne((type): typeof Member => Member, (member) => member.comments, {
    onDelete: 'CASCADE',
  })
  member: Member;
>>>>>>> dd66f62abe0768f289b15ceaa93a9b7e235910ed
}
