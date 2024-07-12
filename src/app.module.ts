import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmModuleOptions } from './configs/database.config';
import { ConfigModuleValidationSchema } from './configs/env.validation.config';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      // isGlobal: ConfigModule 을 전역으로 사용
      isGlobal: true,
      // validationSchema: 환경변수들에대한 유효성 검증
      // 따로 파일 만들어서 import 해서 가져오기
      validationSchema: ConfigModuleValidationSchema,
    }),
    TypeOrmModule.forRootAsync(TypeOrmModuleOptions),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
