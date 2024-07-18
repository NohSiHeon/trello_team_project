import { ApiProperty, PickType } from '@nestjs/swagger';

import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class UpdateCommentDto {
  //boardid
  @IsNotEmpty({ message: '내용을 입력해주세요' })
  @IsNumber()
  boardId: number;

  //수정 댓글
  @ApiProperty({
    description: '수정할 댓글 내용',
    example: '수정할 내용을 입력해주세요',
  })
  @IsNotEmpty({ message: '내용을 입력해주세요' })
  @IsString()
  content: string;
}
