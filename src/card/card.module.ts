import { Module } from '@nestjs/common';
import { CardController } from './card.controller';
import { CardService } from './card.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Card } from './entities/card.entity';
import { List } from 'src/list/entities/list.entity';
import { CardOrder } from 'src/list/entities/cardOrder.entity';
import { Member } from 'src/board/entities/member.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Card, List, CardOrder, Member])],
  controllers: [CardController],
  providers: [CardService],
  exports: [CardService],
})
export class CardModule {}
