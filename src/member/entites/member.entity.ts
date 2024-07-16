import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { IsNumber } from 'class-validator';
import { Assignee } from 'src/card/entities/assignee.entity';
import { User } from 'src/user/entities/user.entity';
import { Board } from 'src/board/entities/board.entity';
import { Comment } from 'src/comment/entities/comment.entity';

@Index(['boardId', 'userId'], { unique: true })
@Entity('members')
export class Member {
  @PrimaryGeneratedColumn({ name: 'member_id' })
  memberId: number;
  /**
   * 보드  id
   * @example 1
   */
  @IsNumber()
  @Column({ unsigned: true })
  boardId: number;

  // /**
  //  * 사용자 id
  //  * @example 1
  //  */
  @IsNumber()
  @Column({ unsigned: true, name: 'user_id' })
  userId: number;

  @OneToMany(() => Assignee, (assignee) => assignee.member)
  assignees: Assignee[];

  @ManyToOne(() => User, (user) => user.members)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Board, (board) => board.members)
  board: Board;

  @OneToMany(() => Comment, (comment) => comment.member)
  comments: Comment[];
}
