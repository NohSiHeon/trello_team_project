import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmModuleOptions } from './configs/database.config';
import { ConfigModuleValidationSchema } from './configs/env.validation.config';
import { ConfigModule } from '@nestjs/config';
import { CommentModule } from './comment/comment.module';
import { ListModule } from './list/list.module';
import { BoardModule } from './board/board.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { CardModule } from './card/card.module';
import { AssigneeModule } from './assignee/assignee.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: ConfigModuleValidationSchema,
    }),
    TypeOrmModule.forRootAsync(TypeOrmModuleOptions),
    CommentModule,
    ListModule,
    BoardModule,
    AuthModule,
    UserModule,
    CardModule,
    AssigneeModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
