import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ListService } from './list.service';
import { CreateListDto } from './dto/create-list.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { User } from 'src/user/entities/user.entity';
import { UserInfo } from 'src/util/user-info.decorator';

@Controller('')
export class ListController {
  constructor(private readonly listService: ListService) {}

  //리스트 생성

  @Post('boards/:id/lists')
  @UseGuards(JwtAuthGuard)
  async createList(
    @Param('id') id: string,
    @UserInfo() user: User,
    @Body() createListDto: CreateListDto,
  ) {
    return await this.listService.createList(+id, user, createListDto);
  }

  //해당하는 보드가 가지고 있는 모든 리스트 조회

  @Get('boards/:id/lists')
  @UseGuards(JwtAuthGuard)
  async findAllList(@Param('id') id: string, @UserInfo() user: User) {
    return this.listService.findAllList(+id, user);
  }

  //리스트 순서 변경

  @Patch('boards/:id/listOrder')
  @UseGuards(JwtAuthGuard)
  async updateListOrder(
    @Param('id') id: string,
    @UserInfo() user: User,
    @Body() updateOrderDto: UpdateOrderDto,
  ) {
    return await this.listService.updateListOrder(+id, user, updateOrderDto);
  }

  //리스트 이름 수정

  @Patch('lists/:id')
  @UseGuards(JwtAuthGuard)
  async updateList(
    @Param('id') id: string,
    @UserInfo() user: User,
    @Body() createListDto: CreateListDto,
  ) {
    return await this.listService.updateList(+id, user, createListDto);
  }

  //리스트 삭제

  @Delete('lists/:id')
  @UseGuards(JwtAuthGuard)
  async removeList(@Param('id') id: string, @UserInfo() user: User) {
    return await this.listService.removeList(+id, user);
  }
}
