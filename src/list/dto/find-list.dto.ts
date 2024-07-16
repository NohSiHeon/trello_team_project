import { IsNotEmpty, IsNumber } from "class-validator";

export class FindListDto {
    @IsNumber()
    @IsNotEmpty({ message: '보드 ID를 입력해주세요.' })
    boardId: number;
}