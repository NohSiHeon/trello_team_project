import { Member } from 'src/board/entities/member.entity';
import { Card } from 'src/card/entities/card.entity';
import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

@Entity('assignees')
export class Assignee {
  @PrimaryColumn({ name: 'card_id' })
  cardId: number;

  @PrimaryColumn({ name: 'user_id', unsigned: true })
  userId: number;

  // @ManyToOne(() => Card, (card) => card.assignees, { onDelete: 'CASCADE' })
  // @JoinColumn({ name: 'card_id', referencedColumnName: 'id' })
  // card?: Card;

  // @ManyToOne(() => Member, (member) => member.assignees)
  // @JoinColumn({ name: 'user_id', referencedColumnName: 'user_id' })
  // member: Member;
}
