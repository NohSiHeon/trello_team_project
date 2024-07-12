import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  //이민준 코드(스웨거 및 전역파이트)
  //전역 파이프 설정
  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, //페이로드를 DTO 클래스 인스턴스로 변환
      whitelist: true, // DTO 클래스에 명시적으로 정의된 속성들만 요청에서 허용
      forbidNonWhitelisted: true, // DTO에 정의되지 않은 속성이 포함되어 있으면 요청 거부
    }),
  );

  const config = new DocumentBuilder() //swagger 관련 함수
    .setTitle('Sparta') //swagger 문서 제목
    .setDescription('Documebt') //swagger 문서 설명을 "ㅇㅇ"로 설정
    .setVersion('3.0') // 문서 버전
    .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }) // 스웨거에 토큰 인증 창 생성, 인증값설정
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      persistAuthorization: true, // 새로고침 시에도 JWT 유지
      tagsSorter: 'alpha', // API 그룹 정렬을 알파벳 순으로
      operationSorter: 'alpha', // API 그룹 내 정렬을 알파벳 순으로
    },
  });
  //이민준 코드여기까지 추가

  await app.listen(3000);
}
bootstrap();
