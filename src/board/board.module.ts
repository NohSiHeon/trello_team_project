import { Module } from '@nestjs/common';
import { BoardService } from './board.service';
import { BoardController } from './board.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Board } from './entities/board.entity';
import { Member } from './entities/member.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Board, Member])],
  controllers: [BoardController],
  providers: [BoardService],
})
export class BoardModule {}
