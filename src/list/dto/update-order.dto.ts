import { IsNotEmpty, IsNumber } from "class-validator";

export class UpdateOrderDto {
    @IsNumber()
    @IsNotEmpty({ message: '리스트 id를 입력해주세요.' })
    listId: number
    
    @IsNumber()
    @IsNotEmpty({ message: '변경 순서를 입력해주세요.' })
    sort: number;
}
