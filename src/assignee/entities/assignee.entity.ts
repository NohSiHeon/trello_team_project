import { Card } from 'src/card/entities/card.entity';
import { Member } from 'src/member/entities/member.entity';
import { Entity, ManyToOne, PrimaryColumn, Unique } from 'typeorm';

@Unique(['cardId', 'userId'])
@Entity('assignees')
export class Assignee {
  @PrimaryColumn()
  cardId: number;

  @PrimaryColumn()
  userId: number;

  @ManyToOne((type) => Card, (card) => card.assignees, { onDelete: 'CASCADE' })
  card?: Card;

  @ManyToOne((type) => Member, (member) => member.assignee)
  members: Member[];
}
