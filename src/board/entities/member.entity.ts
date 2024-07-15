import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { IsNumber } from 'class-validator';
//import { Assignee } from 'src/assignee/entities/assignee.entity';

@Entity('members')
export class Member {
  /**
   * 멤버 아이디
   * @example 1
   */
  @PrimaryGeneratedColumn({ unsigned: true })
  id: number;

  /**
   * 보드  id
   * @example 1
   */
  @IsNumber()
  @Column({ unsigned: true })
  boardId: number;

  /**
   * 사용자 id
   * @example 1
   */
  @IsNumber()
  @Column({ name: 'user_id', unsigned: true })
  userId: number;

  // @OneToMany(() => Assignee, (assignee) => assignee.member)
  // assignees: Assignee[];
}
