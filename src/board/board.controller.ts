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
} from '@nestjs/common';
import { BoardService } from './board.service';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
//import { assignmentDto } from './dto/assignment.dto';

@ApiTags('boards')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('board')
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
    const boardTitle = createBoardDto.title;

    const data = await this.boardService.create(userId, boardTitle);

    return {
      statusCode: HttpStatus.CREATED,
      message: '보드 생성에 성공했습니다',
      data: data,
    };
  }
  /**
   * 보드 목록 조회
   * @param req
   * @returns
   */
  @Get()
  async findAll(@Request() req) {
    const userId = req.user.id;
    const data = await this.boardService.findAll(userId);

    return {
      statusCode: HttpStatus.OK,
      message: '보드 목록 조회에 성공했습니다.',
      data: data,
    };
  }

  /**
   * 보드 상세 조회
   * @param req
   * @param id
   * @returns
   */
  @Get(':boardId')
  findOne(@Request() req, @Param('id') id: number) {
    return this.boardService.findOne(+id);
  }

  /**
   * 보드 수정
   * @param boardId
   * @param updateBoardDto
   * @returns
   */
  @Patch(':boardId')
  update(@Param('id') boardId: number, @Body() updateBoardDto: UpdateBoardDto) {
    return this.boardService.update(+boardId, updateBoardDto);
  }

  /**
   * 보드 삭제
   * @param boardId
   * @returns
   */
  @Delete(':boardId')
  remove(@Param('id') boardId: number) {
    return this.boardService.remove(+boardId);
  }
  /*
  @UseGuards(AuthGuard('jwt'))
  @Post(':id')
  assignment(
    @Request() req,
    @Param('id') boardId: number,
    @Body('email') email: assignmentDto,
  ) {
    const adminId = req.user.id;
    return this.boardService.assignment(+adminId, +boardId, email);
  }
    */
}
