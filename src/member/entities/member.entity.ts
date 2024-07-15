import { Assignee } from 'src/assignee/entities/assignee.entity';
import { Entity, ManyToOne, OneToMany, PrimaryColumn } from 'typeorm';

@Entity('members')
export class Member {
  @PrimaryColumn()
  boardId: number;

  @PrimaryColumn()
  userId: number;

  @OneToMany((type) => Assignee, (assignee) => assignee.members)
  assignee: Assignee;

  @ManyToOne((type) => User, (user) => user.member)
  user: User;
}
