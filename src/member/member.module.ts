import { forwardRef, Module } from '@nestjs/common';
import { MemberService } from './member.service';
import { Member } from './entites/member.entity';
import { Board } from 'src/board/entities/board.entity';
import { User } from 'src/user/entities/user.entity';
import { Assignee } from 'src/card/entities/assignee.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Member, Board, User, Assignee]),
    forwardRef(() => AuthModule),
  ],
  providers: [MemberService],
  exports: [MemberService],
})
export class MemberModule {}
