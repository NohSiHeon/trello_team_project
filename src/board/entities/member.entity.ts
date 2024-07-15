import { Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { IsNumber } from 'class-validator';
import { User } from 'src/user/entities/user.entity';
import { Board } from './board.entity';
import { Assignee } from 'src/assignee/entities/assignee.entity';

@Entity('members')
export class Member {
  /**
   * 보드  id
   * @example 1
   */
  @IsNumber()
  @PrimaryColumn({ unsigned: true })
  boardId: number;

  /**
   * 사용자 id
   * @example 1
   */
  @IsNumber()
  @PrimaryColumn({ unsigned: true })
  userId: number;

  @OneToMany(() => Assignee, (assignee) => assignee.members)
  assignee: Assignee;
}
