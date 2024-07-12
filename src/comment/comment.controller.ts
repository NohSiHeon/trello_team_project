import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Controller('comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  // 댓글생성
  @Post('/cards/comments') //:cardid 추가
  async create(
    // @Param('cardId') cardId: string, < 합치고 추가
    @Body() createCommentDto: CreateCommentDto,
  ) {
    const data = await this.commentService.create(createCommentDto); //+cardId 합치고 추가
    return {
      status: HttpStatus.CREATED,
      message: '댓글 생성에 성공하였습니다.',
      data,
    };
  }

  // 댓글조회
  @Get('/:id')
  async findOne(@Param('id') id: string) {
    const data = await this.commentService.findOne(+id);
    return {
      status: HttpStatus.OK,
      message: '댓글 조회에 성공하였습니다다.',
      data,
    };
  }

  // 댓글수정
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateCommentDto: UpdateCommentDto,
  ) {
    const data = await this.commentService.update(+id, updateCommentDto);
    return {
      status: HttpStatus.CREATED,
      message: '댓글 수정에 성공하였습니다.',
      data,
    };
  }

  // 댓글삭제
  @Delete(':id')
  async remove(@Param('id') id: string) {
    const data = await this.commentService.remove(+id);
    return {
      status: HttpStatus.OK,
      message: '댓글 삭제에 성공하였습니다.',
      data,
    };
  }
}
