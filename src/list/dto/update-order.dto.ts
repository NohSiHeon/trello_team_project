import { IsNotEmpty, IsNumber } from "class-validator";

export class UpdateOrderDto {
    @IsNumber()
    @IsNotEmpty({ message: '보드 ID를 입력해주세요.' })
    boardId: number;

    @IsNumber()
    @IsNotEmpty({ message: '리스트 ID를 입력해주세요.' })
    listId: number
    
    @IsNumber()
    @IsNotEmpty({ message: '변경 순서를 입력해주세요.' })
    sort: number;
}
