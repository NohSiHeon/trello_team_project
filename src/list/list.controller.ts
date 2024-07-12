import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ListService } from './list.service';
import { CreateListDto } from './dto/create-list.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('')
export class ListController {
  constructor(private readonly listService: ListService) {}

  //리스트 생성

  @Post('boards/:id/lists')
  //@UseGuards(AuthGuard('jwt'))
  async createList(@Param('id') id: string, @Body() createListDto: CreateListDto) {
    return await this.listService.createList(+id, createListDto);
  }

  //해당하는 보드가 가지고 있는 모든 리스트 조회

  @Get('boards/:id/lists')
  async findAllList(@Param('id') id: string) {
    return this.listService.findAllList(+id);
  }

  //리스트 이름 수정

  @Patch('lists/:id')
  async updateList(@Param('id') id: string, @Body() createListDto: CreateListDto) {
    return await this.listService.updateList(+id, createListDto);
  }

  //리스트 삭제

  @Delete('lists/:id')
  async removeList(@Param('id') id: string) {
    return await this.listService.removeList(+id);
  }
}
