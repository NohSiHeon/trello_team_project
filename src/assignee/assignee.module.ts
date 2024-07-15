import { Module } from '@nestjs/common';
import { AssigneeController } from './assignee.controller';
import { AssigneeService } from './assignee.service';

@Module({
  controllers: [AssigneeController],
  providers: [AssigneeService]
})
export class AssigneeModule {}
