import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateAssigneeDto {
  @IsString()
  @IsNotEmpty()
  assignee: string;
}
