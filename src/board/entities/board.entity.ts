import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { BackgroundColorTypes } from '../types/backgroud-color.types';

//swagger 사용 고려한 주석
@Entity('shows')
export class Show {
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
  @Column({ type: 'enum', enum: BackgroundColorTypes })
  backgroundColor: BackgroundColorTypes;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
