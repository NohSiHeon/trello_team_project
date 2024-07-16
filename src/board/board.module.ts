import { Module } from '@nestjs/common';
import { BoardService } from './board.service';
import { BoardController } from './board.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { User } from 'src/user/entities/user.entity';
import { Card } from 'src/card/entities/card.entity';
import { List } from 'src/list/entities/list.entity';
import { Member } from '../member/entites/member.entity';
import { Board } from './entities/board.entity';
import { Assignee } from 'src/card/entities/assignee.entity';

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET_KEY'),
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([Board, Member, User, Card, List]),
    AuthModule,
  ],
  controllers: [BoardController],
  providers: [BoardService],
})
export class BoardModule {}
