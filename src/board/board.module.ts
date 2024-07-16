import { Module } from '@nestjs/common';
import { BoardService } from './board.service';
import { BoardController } from './board.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Member } from '../member/entites/member.entity';
import { Board } from './entities/board.entity';
import { Assignee } from 'src/card/entities/assignee.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Board, Member, Assignee])],
  controllers: [BoardController],
  providers: [BoardService],
})
export class BoardModule {}
