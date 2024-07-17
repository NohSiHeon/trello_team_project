# prj.trello_team_project

## 목표

"nest.js, MySQL을 활용해 프로젝트 협업 도구(칸반보드) 만들기"


## 프로젝트 완료 시 할 수 있는 것

1. **API 명세서를 작성**하여 프론트엔드 개발자와 원활히 협업
2. **ERD를 작성**하여 RDB(MySQL)를 이용한 데이터 모델링
3. **MySQL, TypeORM**를 이용해 데이터베이스를 설계하고 활용
4. **TypeScript, Nest.js**를 이용해 서버를 개발
4. **jest**를 사용해 유닛테스트
5. **CI/CD** 파이프라인을 구축하여 개발 프로세스의 효율성 높이기

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.


## project clone

```
git clone https://github.com/blueclorox/trello_team_project.git
```

## env

`.env` 파일을 생성하고 다음 내용을 추가합니다:

```env
SERVER_PORT=3000
DB_HOST="your-database-host"
DB_PORT="your-database-port"
DB_USERNAME="your-database-username"
DB_PASSWORD="your-database-password"
DB_NAME="your-database-name"
DB_SYNC=true
JWT_SECRET_KEY="your_secret_key"
```

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## API 명세서

[트렐로 프로젝트 API 명세서](https://www.notion.so/teamsparta/67e8cd7ccada44d597d2b8fdd5a7fb38?v=de0b404e0f0447a280d24d2d50a0006a&pvs=4)

## ERD (Entity Relationship Diagram)

[트렐로 프로젝트 ERD](https://drawsql.app/teams/les-team-1/diagrams/easy)

## 인증 및 인가

- **JWT, UseGuards**를 사용하여 인증 및 인가를 처리합니다.

## 배포

- **PM2**를 이용하여 웹 서비스를 베포합니다.
- **http://3.38.183.70:3000/api**


## 개발 환경

- Nest.js
- npm
- MySQL
- TypeORM
- Jest

---------------------------

## Commit Convention

| 작업 타입 | 작업내용                    |
| --------- | --------------------------- |
| feat      | 새로운 기능 추가            |
| fix       | 버그 수정                   |
| perf      | 성능 개선                   |
| build     | 모듈, 패키지 설치, 삭제     |
| add       | 새 파일 생성                |
| move      | 파일 옮김, 정리             |
| remove    | 파일 삭제                   |
| rename    | 파일명, 폴더명, 변수명 수정 |
| refactor  | 코드 리팩토링               |
| chore     | 그 외 자잘한 수정           |
| comment   | 주석 추가, 수정             |
| test      | 테스트 코드 추가, 수정      |
| docs      | readme 문서 수정            |
| gitfix    | gitignore 수정              |

## 문의

- 문의는 Issues로 남겨주세요.

---------------------------
