import {
  IsDateString,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { CardColor } from '../types/card-color.type';

export class CreateCardDto {
  @IsInt({ message: '정수를 입력해주세요.' })
  @IsNotEmpty({ message: '리스트 값을 입력해주세요.' })
  listId: number;

  @IsString({ message: '문자열을 입력해주세요.' })
  @IsNotEmpty({ message: '카드 이름을 입력해주세요.' })
  title: string;

  @IsOptional()
  @IsString()
  description: string;

  @IsOptional()
  @IsDateString()
  dueDate: Date;

  @IsOptional()
  @IsEnum(CardColor)
  color: CardColor;
}
