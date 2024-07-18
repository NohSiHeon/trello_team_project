import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateListDto {
    @IsNumber()
    @IsNotEmpty({ message: '보드 ID를 입력해주세요.' })
    boardId: number;

    @IsString()
    @IsNotEmpty({ message: '리스트 명을 입력해주세요.' })
    title: string;
}
