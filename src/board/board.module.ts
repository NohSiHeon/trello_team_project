import { Module } from '@nestjs/common';
import { BoardService } from './board.service';
import { BoardController } from './board.controller';
import { Assignee } from 'src/assignee/entities/assignee.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Board } from './entities/board.entity';
import { Member } from './entities/member.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Board, Member, Assignee]), AuthModule],
  controllers: [BoardController],
  providers: [BoardService],
})
export class BoardModule {}
