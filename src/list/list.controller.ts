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

  @Patch('lists/:id')
  async updateList(@Param('id') id: string, @Body() createListDto: CreateListDto) {
    return await this.listService.updateList(+id, createListDto);
  }

  @Delete('lists/:id')
  async removeList(@Param('id') id: string) {
    return await this.listService.removeList(+id);
  }

  // @Get()
  // findAll() {
  //   return this.listService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.listService.findOne(+id);
  // }
}
