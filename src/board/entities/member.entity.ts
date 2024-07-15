import { Entity, PrimaryColumn } from 'typeorm';

@Entity('members')
export class Member {
  @PrimaryColumn()
  boardId: number;

  @PrimaryColumn()
  userId: number;
}
