import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('댓글 API')
@Controller('comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  /**
   * 댓글 생성
   * @param createCommentDto
   * @returns
   */
  @Post()
  async create(@Body() createCommentDto: CreateCommentDto) {
    const data = await this.commentService.create(createCommentDto); //+cardId 합치고 추가
    return {
      status: HttpStatus.CREATED,
      message: '댓글 생성에 성공하였습니다.',
      data,
    };
  }

  /**
   * 댓글 조회
   * @param id
   * @returns
   */
  @Get('/:id')
  async findOne(@Param('id') id: string) {
    const data = await this.commentService.findOne(+id);
    return {
      status: HttpStatus.OK,
      message: '댓글 조회에 성공하였습니다다.',
      data,
    };
  }

  /**
   * 댓글 수정
   * @param id
   * @param updateCommentDto
   * @returns
   */
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

  /**
   * 댓글 전체 조회 api
   * @param cardId
   * @returns
   */
  @Get()
  async findAll(@Query('card_id') card_id: number) {
    const data = await this.commentService.findAll(card_id);
    return {
      status: HttpStatus.OK,
      message: '댓글 전체 조회에 성공하였습니다',
      data,
    };
  }

  /**
   * 댓글 삭제
   * @param id
   * @returns
   */
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
