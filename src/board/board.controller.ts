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
} from '@nestjs/common';
import { BoardService } from './board.service';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import { AuthGuard } from '@nestjs/passport';
//import { assignmentDto } from './dto/assignment.dto';

@Controller('board')
export class BoardController {
  constructor(private readonly boardService: BoardService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  async create(@Request() req, @Body() createBoardDto: CreateBoardDto) {
    const userId = req.user.id;
    const boardTitle = createBoardDto.title;

    const data = await this.boardService.create(userId, boardTitle);

    return data;
  }

  @UseGuards(AuthGuard('jwt'))
  @Get()
  async findAll(@Request() req) {
    const userId = req.user.id;
    const data = await this.boardService.findAll(userId);

    return data;
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':boardId')
  findOne(@Request() req, @Param('id') id: number) {
    return this.boardService.findOne(+id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  update(@Param('id') boardId: number, @Body() updateBoardDto: UpdateBoardDto) {
    return this.boardService.update(+boardId, updateBoardDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.boardService.remove(+id);
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
