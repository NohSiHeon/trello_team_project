import { Module } from '@nestjs/common';
import { AssigneeController } from './assignee.controller';
import { AssigneeService } from './assignee.service';
import { Card } from 'src/card/entities/card.entity';
import { Member } from 'src/board/entities/member.entity';

@Module({
  imports: [Card, Member],
  controllers: [AssigneeController],
  providers: [AssigneeService],
})
export class AssigneeModule {}
