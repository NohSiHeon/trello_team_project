import { Module } from '@nestjs/common';
import { CardController } from './card.controller';
import { CardService } from './card.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Card } from './entities/card.entity';
import { List } from 'src/list/entities/list.entity';
import { Member } from 'src/member/entites/member.entity';
import { MemberModule } from 'src/member/member.module';
import { AuthModule } from 'src/auth/auth.module';
import { Assignee } from 'src/card/entities/assignee.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Card, List, Member, Assignee]),
    MemberModule,
    AuthModule,
  ],
  controllers: [CardController],
  providers: [CardService],
})
export class CardModule {}
