import { IsNotEmpty, IsString } from "class-validator";

export class CreateListDto {
    @IsString()
    @IsNotEmpty({ message: '리스트 명을 입력해주세요.' })
    title: string;
}
