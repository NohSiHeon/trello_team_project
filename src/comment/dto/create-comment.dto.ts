import { PickType } from '@nestjs/swagger';
import { Comment } from '../entities/comment.entity';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateCommentDto extends PickType(Comment, ['content']) {
  /**
   * 보드 ID
   * @example "1"
   */
  @IsNotEmpty({ message: '보드 ID를 입력해주세요' })
  @IsNumber()
  boardId: number;

  /**
   * 카드 ID
   * @example "1"
   */
  @IsNotEmpty({ message: '카드 ID를 입력해주세요' })
  @IsNumber()
  cardId: number;
}
