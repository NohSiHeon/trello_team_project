import { IsInt, IsNotEmpty } from 'class-validator';

export class UpdateAssigneeDto {
  @IsInt()
  @IsNotEmpty()
  userId: number;

  @IsInt()
  @IsNotEmpty()
  boardId: number;
}
