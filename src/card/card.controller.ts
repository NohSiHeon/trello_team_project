import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { Card } from './entities/card.entity';
import { CreateCardDto } from './dtos/create-card.dto';
import { ApiResponse } from './interfaces/api-response';
import { CardService } from './card.service';
import { UpdateCardDto } from './dtos/update-card.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UpdateAssigneeDto } from './dtos/update-assignee.dto';
import { MemberGuard } from 'src/auth/guards/member-auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UpdateCardOrderDto } from './dtos/update-card-order.dto';
import { UserInfo } from 'src/util/user-info.decorator';
import { User } from 'src/user/entities/user.entity';
// import { UpdateAssigneeDto } from './dtos/update-assignee.dto';

@ApiTags('cards')
@UseGuards(JwtAuthGuard)
@UseGuards(MemberGuard)
@ApiBearerAuth()
@Controller('cards')
export class CardController {
  constructor(private readonly cardService: CardService) {}

  /**
   * 카드 생성
   * @param createCardDto
   * @returns
   */
  @Post()
  async createCard(
    @UserInfo() user: User,
    @Body() createCardDto: CreateCardDto,
  ): Promise<ApiResponse<Card>> {
    return this.cardService.createCard(createCardDto);
  }

  /**
   * 카드 조회
   * @returns
   */
  @Get()
  async getAllCards(
    @UserInfo() user: User,
    @Query('listId') listId: number,
  ): Promise<ApiResponse<Card[]>> {
    return await this.cardService.getAllCards(listId);
  }

  /**
   * 카드 상세 조회
   * @param cardId : 카드 ID
   * @returns
   */
  @Get(':cardId')
  async getCard(
    @UserInfo() user: User,
    @Param('cardId') cardId: number,
  ): Promise<ApiResponse<Card>> {
    return await this.cardService.getCard(cardId);
  }

  /**
   * 카드 삭제
   * @param cardId
   * @returns
   */
  @Delete(':cardId')
  async deleteCard(
    @UserInfo() user: User,
    @Param('cardId') cardId: number,
  ): Promise<ApiResponse<Card>> {
    return await this.cardService.deleteCard(cardId);
  }

  /**
   * 카드 수정
   * @param cardId
   * @param updateCardDto
   * @returns
   */
  @Patch(':cardId')
  async updateCard(
    @UserInfo() user: User,
    @Param('cardId') cardId: number,
    @Body() updateCardDto: UpdateCardDto,
  ): Promise<ApiResponse<Card>> {
    return await this.cardService.updateCard(cardId, updateCardDto);
  }

  /**
   * 작업자 할당, 변경
   * @param updateAssigneeDto
   */

  @Patch(':cardId/assignee')
  async updateAssignee(
    @UserInfo() user: User,
    @Param('cardId') cardId: number,
    @Body() updateAssigneeDto: UpdateAssigneeDto,
  ) {
    return await this.cardService.updateAssignee(cardId, updateAssigneeDto);
  }

  /**
   * 카드 이동
   * @param cardId
   * @param updateCardOrderDto
   * @returns
   */
  @Patch(':cardId/order')
  async updateCardOrder(
    @UserInfo() user: User,
    @Param('cardId') cardId: number,
    @Body() updateCardOrderDto: UpdateCardOrderDto,
  ) {
    return await this.cardService.updateCardOrder(cardId, updateCardOrderDto);
  }
}
