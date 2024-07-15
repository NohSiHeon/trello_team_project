import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { BackgroundColorTypes } from '../types/backgroud-color.types';
import { List } from 'src/list/entities/list.entity';
import { ListOrder } from 'src/list/entities/listOrder.entity';

//swagger 사용 고려한 주석
@Entity('boards')
export class Board {
  @PrimaryGeneratedColumn({ unsigned: true })
  id: number;

  /**
   * 보드 생성 사용자 id
   * @example 1
   */
  @IsNumber()
  @Column({ unsigned: true })
  adminId: number;

  /**
   * 보드 제목
   * @example "쉽게 생성된 보드"
   */
  @IsNotEmpty({ message: '보드 제목을 입력해주세요.' })
  @IsString()
  @Column()
  title: string;

  /**
   * 배경 색
   * @example "red"
   */
  @IsEnum(BackgroundColorTypes)
  @Column({ type: 'enum', enum: BackgroundColorTypes, default: 'Red' })
  backgroundColor: BackgroundColorTypes | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => List, (list) => list.board)
  list: List[];

  @OneToOne(() => ListOrder, (listOrder) => listOrder.board, { cascade: true })
  listOrder: ListOrder;
}
