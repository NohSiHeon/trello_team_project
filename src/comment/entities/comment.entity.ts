import { IsNotEmpty, IsString } from 'class-validator';

import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({
  name: 'comments',
})
export class Comment {
  @PrimaryGeneratedColumn({ unsigned: true })
  id: number;

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
