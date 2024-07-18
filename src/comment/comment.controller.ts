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
  UseGuards,
  Req,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { User } from 'src/user/entities/user.entity';
import { UserInfo } from 'src/util/user-info.decorator';
import { CurrentUserMemberGuard } from 'src/auth/guards/current-user-member-auth.guard';

@ApiTags('댓글 API')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, CurrentUserMemberGuard)
@Controller('comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  /**
   * 댓글 생성
   * @param createCommentDto
   * @returns
   */
  @Post()
  async create(
    @UserInfo() user: User,
    @Body() createCommentDto: CreateCommentDto,
  ) {
    const data = await this.commentService.create(user, createCommentDto);
    return data;
  }

  /**
   * 댓글 상세 조회
   * @param commentId
   * @Query boardId "asd"
   * @returns
   */
  @Get('/:commentId')
  async findOne(
    @Param('commentId') commentId: string,
    @Query('boardId') boardId: number,
  ) {
    const data = await this.commentService.findOne(+commentId, boardId);
    return data;
  }

  /**
   * 댓글 수정
   * @param id
   * @param updateCommentDto
   * @returns
   */
  @Patch(':commentId')
  async update(
    @Param('commentId') commentId: string,
    @UserInfo() user: User,
    @Body() updateCommentDto: UpdateCommentDto,
  ) {
    const data = await this.commentService.update(
      +commentId,
      updateCommentDto,
      user.id,
    );

    return data;
  }

  /**
   * 댓글 전체 조회 api
   * @param cardId
   * @returns
   */
  @Get()
  async findAll(
    @Query('cardId') cardId: number,
    @Query('boardId') boardId: number,
  ) {
    const data = await this.commentService.findAll(cardId, boardId);
    return data;
  }

  /**
   * 댓글 삭제
   * @param id
   * @returns
   */
  @Delete(':id')
  async remove(
    @Param('id') id: string,
    @UserInfo() user: User,
    @Query('boardId') boardId: number,
  ) {
    const data = await this.commentService.remove(+id, user.id, boardId);
    return data;
  }
}
