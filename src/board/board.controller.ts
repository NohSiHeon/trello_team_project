import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  HttpStatus,
  ParseIntPipe,
} from '@nestjs/common';
import { BoardService } from './board.service';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UserInfo } from 'src/util/user-info.decorator';
import { User } from 'src/user/entities/user.entity';
import { CheckEmailDto } from 'src/user/dto/check-email.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { MemberGuard } from 'src/auth/guards/member-auth.guard';
import { createResponse } from 'src/util/response-util';
import { MESSAGES } from 'src/constants/message.constant';

@ApiTags('boards')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('boards')
export class BoardController {
  constructor(private readonly boardService: BoardService) {}

  /**
   * 보드 생성
   * @param req
   * @param createBoardDto
   * @returns
   */
  @Post()
  async create(@Request() req, @Body() createBoardDto: CreateBoardDto) {
    const userId = req.user.id;
    console.log(userId);
    const boardTitle = createBoardDto.title;

    return await this.boardService.create(userId, boardTitle);
  }
  /**
   * 보드 목록 조회
   * @param req
   * @returns
   */
  @Get()
  async findAll(@Request() req) {
    const userId = req.user.id;

    return await this.boardService.findAll(userId);
  }

  /**
   * 보드 상세 조회
   * @param req
   * @param id
   * @returns
   */
  @Get(':boardId')
  findOne(@Param('boardId') boardId: number) {
    return this.boardService.findOne(+boardId);
  }

  /**
   * 보드 수정
   * @param req
   * @param boardId
   * @param updateBoardDto
   * @returns
   */
  @Patch(':boardId')
  update(
    @Param('boardId') boardId: number,
    @UserInfo() user: User,
    @Body() updateBoardDto: UpdateBoardDto,
  ) {
    return this.boardService.update(user, +boardId, updateBoardDto);
  }

  /**
   * 어드민 변경
   * @param boardId
   * @param updateAdminDto
   * @returns
   */
  @UseGuards(MemberGuard)
  @Patch(':boardId/admin')
  updateAdminUser(
    @Param('boardId', ParseIntPipe) id: number,
    @Body() updateAdminDto: UpdateAdminDto,
  ) {
    const data = this.boardService.updateAdmin(id, updateAdminDto);
    return createResponse(
      HttpStatus.OK,
      MESSAGES.BOARD.UPDATE_ADMIN.SUCCEED,
      data,
    );
  }

  /**
   * 보드 삭제
   * @param boardId
   * @returns
   */
  @Delete(':boardId')
  remove(@Param('boardId') boardId: number) {
    return this.boardService.remove(+boardId);
  }

  /**
   * 보드 초대
   * @param req
   * @param boardId
   * @param email
   * @returns
   */
  @Post(':boardId/invite')
  inviteMember(
    @Request() req,
    @Param('boardId') boardId: number,
    @Body() email: CheckEmailDto,
  ) {
    const adminId = req.user.id;
    return this.boardService.inviteMember(+adminId, +boardId, email);
  }
}
