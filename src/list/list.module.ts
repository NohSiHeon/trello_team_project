import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ListService } from './list.service';
import { ListController } from './list.controller';
import { List } from './entities/list.entity';
import { Board } from 'src/board/entities/board.entity';
import { ListOrder } from './entities/listOrder.entity';
import { CardOrder } from './entities/cardOrder.entity';
import { Member } from 'src/board/entities/member.entity';
import { AuthModule } from 'src/auth/auth.module';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET_KEY'),
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([List, Board, ListOrder, CardOrder, Member]),
    AuthModule,
  ],
  providers: [ListService],
  controllers: [ListController],
  exports: [ListService],
})
export class ListModule {}
