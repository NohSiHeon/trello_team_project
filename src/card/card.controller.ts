import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { Card } from './entities/card.entity';
import { CreateCardDto } from './dtos/create-card.dto';
import { ApiResponse } from './interfaces/api-response';
import { CardService } from './card.service';
import { UpdateCardDto } from './dtos/update-card.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
// import { UpdateAssigneeDto } from './dtos/update-assignee.dto';

@UseGuards(JwtAuthGuard)
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
    @Body() createCardDto: CreateCardDto,
  ): Promise<ApiResponse<Card>> {
    return this.cardService.createCard(createCardDto);
  }

  /**
   * 카드 조회
   * @returns
   */
  @Get()
  async getAllCards(): Promise<ApiResponse<Card[]>> {
    return await this.cardService.getAllCards();
  }

  /**
   * 카드 상세 조회
   * @param cardId : 카드 ID
   * @returns
   */
  @Get(':cardId')
  async getCard(@Param('cardId') cardId: number): Promise<ApiResponse<Card>> {
    return await this.cardService.getCard(cardId);
  }

  /**
   * 카드 삭제
   * @param cardId
   * @returns
   */
  @Delete(':cardId')
  async deleteCard(
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
    @Param('cardId') cardId: number,
    @Body() updateCardDto: UpdateCardDto,
  ): Promise<ApiResponse<Card>> {
    return await this.cardService.updateCard(cardId, updateCardDto);
  }

  /**
   * 작업자 할당, 변경
   * @param updateAssigneeDto
   */
  // @Patch(':cardId/assign')
  // async updateAssignee(@Body() updateAssigneeDto: UpdateAssigneeDto) {}
}
