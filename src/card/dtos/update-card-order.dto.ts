import { IsInt, IsNotEmpty } from 'class-validator';

export class UpdateCardOrderDto {
  @IsInt()
  @IsNotEmpty()
  listId: number;

  @IsInt()
  @IsNotEmpty()
  newOrder: number;
}
