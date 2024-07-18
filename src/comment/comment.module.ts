import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { Comment } from './entities/comment.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Card } from 'src/card/entities/card.entity';
import { MemberModule } from 'src/member/member.module';
import { Member } from 'src/member/entites/member.entity';
import { Board } from 'src/board/entities/board.entity';
import { List } from 'src/list/entities/list.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Comment, Card, Member, Board, List]),
    MemberModule,
  ],
  controllers: [CommentController],
  providers: [CommentService],
})
export class CommentModule {}
