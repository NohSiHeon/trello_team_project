import { Card } from 'src/card/entities/card.entity';
import { Member } from 'src/member/entites/member.entity';
import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

@Entity('assignees')
export class Assignee {
  @PrimaryColumn({ name: 'card_id' })
  cardId: number;

  @PrimaryColumn({ name: 'member_id' })
  memberId: number;

  @ManyToOne(() => Card, (card) => card.assignees, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'card_id', referencedColumnName: 'id' })
  card?: Card;

  @ManyToOne(() => Member, (member) => member.assignees, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'member_id' })
  member: Member;
}
