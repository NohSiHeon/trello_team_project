import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ListService } from './list.service';
import { ListController } from './list.controller';
import { List } from './entities/list.entity';
import { Board } from 'src/board/entities/board.entity';
import { ListOrder } from './entities/listOrder.entity';
import { CardOrder } from './entities/cardOrder.entity';

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET_KEY'),
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([List, Board, ListOrder, CardOrder]),
  ],
  providers: [ListService],
  controllers: [ListController],
  exports: [ListService],
})
export class ListModule {}
