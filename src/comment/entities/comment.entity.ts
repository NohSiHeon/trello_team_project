import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'comments' })
export class Comment {
  @PrimaryGeneratedColumn({ unsigned: true })
  id: number;

  /**
   * 카드 id
   * @example "1"
   */
  @IsNotEmpty({ message: 'cardId를 입력해주세요' })
  @IsNumber()
  @Column()
  cardId: number;

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

  // @ManyToOne((type): typeof Card => Card, (card) => card.comments, {
  //   onDelete: 'CASCADE',
  // })
  // card: Card;

  // @ManyToOne((type): typeof Merber => Merber, (merber) => merber.comments, {
  //   onDelete: 'CASCADE',
  // })
  // merber: Merber;
}
