import { IsDateString, IsEnum, IsOptional, IsString } from 'class-validator';
import { CardColor } from '../types/card-color.type';

export class UpdateCardDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsDateString()
  dueDate?: Date;

  @IsOptional()
  @IsEnum(CardColor)
  color?: CardColor;
}
