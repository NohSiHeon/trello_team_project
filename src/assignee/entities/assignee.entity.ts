import { Member } from 'src/board/entities/member.entity';
import { Card } from 'src/card/entities/card.entity';
import { Entity, ManyToOne, PrimaryColumn, Unique } from 'typeorm';

@Unique(['cardId', 'userId'])
@Entity('assignees')
export class Assignee {
  @PrimaryColumn()
  cardId: number;

  @PrimaryColumn()
  userId: number;

  @ManyToOne(() => Card, (card) => card.assignees, { onDelete: 'CASCADE' })
  card?: Card;

  @ManyToOne(() => Member, (member) => member.assignee)
  members: Member[];
}
