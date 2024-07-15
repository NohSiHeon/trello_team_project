import { Module } from '@nestjs/common';
import { BoardService } from './board.service';
import { BoardController } from './board.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Member } from './entities/member.entity';
import { Board } from './entities/board.entity';
import { Assignee } from 'src/assignee/entities/assignee.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Board, Member, Assignee])],
  controllers: [BoardController],
  providers: [BoardService],
})
export class BoardModule {}
