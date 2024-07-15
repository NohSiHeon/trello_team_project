import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateCardDto } from './dtos/create-card.dto';
import { Card } from './entities/card.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ApiResponse } from './interfaces/api-response';
import { UpdateCardDto } from './dtos/update-card.dto';

@Injectable()
export class CardService {
  constructor(
    @InjectRepository(Card)
    private cardRepository: Repository<Card>,
    // private listRepository: Repository<List>,
  ) {}

  /**
   * 카드 생성 API
   * @param createCardDto
   * @returns
   */
  async createCard(createCardDto: CreateCardDto): Promise<ApiResponse<Card>> {
    const card = this.cardRepository.create(createCardDto);

    // 리스트 조회
    const list = await this.listRepository.findOne({
      where: {
        id: listId,
      },
    });

    // 리스트 존재 여부 확인
    if (!list) {
      const errorResponse: ApiResponse<Card> = {
        statusCode: HttpStatus.NOT_FOUND,
        message: '존재 하지 않는 리스트입니다.',
        error: 'Not Found',
      };
      return errorResponse;
    }

    // DB에 적용
    await this.cardRepository.save(card);

    // 반환값
    const response: ApiResponse<Card> = {
      statusCode: HttpStatus.CREATED,
      message: '카드 생성에 성공했습니다.',
      data: card,
    };
    return response;
  }

  /**
   * 카드 조회 API
   * @returns
   */
  async getAllCards(): Promise<ApiResponse<Card[]>> {
    // 카드 전부 가져오기
    const card = await this.cardRepository.find({});

    // 반환값
    const response: ApiResponse<Card[]> = {
      statusCode: HttpStatus.OK,
      message: '카드 조회에 성공했습니다.',
      data: card,
      error: 'NotFound',
    };
    return response;
  }

  /**
   * 카드 상세 조회 API
   * @param cardId
   * @returns
   */
  async getCard(cardId: number): Promise<ApiResponse<Card>> {
    // id가 cardId와 일치한 카드 가져오기
    const card = await this.checkCardById(cardId);

    // 카드 없을 때 예외 처리
    if (!card) {
      const errorResponse: ApiResponse<Card> = {
        statusCode: HttpStatus.NOT_FOUND,
        message: '존재하지 않는 카드입니다.',
        error: 'Not Found',
      };
      return errorResponse;
    }

    // 반환값
    const response: ApiResponse<Card> = {
      statusCode: HttpStatus.OK,
      message: '카드 조회에 성공했습니다.',
      data: card,
    };
    return response;
  }

  /**
   * 카드 삭제 API
   * @param cardId
   * @returns
   */
  async deleteCard(cardId: number): Promise<ApiResponse<Card>> {
    // id가 cardId와 일치한 카드 가져오기
    const card = await this.checkCardById(cardId);

    // 카드 없을 때 예외 처리
    if (!card) {
      const errorResponse: ApiResponse<Card> = {
        statusCode: HttpStatus.NOT_FOUND,
        message: '존재하지 않는 카드입니다.',
        error: 'Not Found',
      };
      return errorResponse;
    }
    // 카드 삭제
    await this.cardRepository.delete({
      id: cardId,
    });

    // 반환값
    const response: ApiResponse<Card> = {
      statusCode: HttpStatus.OK,
      message: '카드 삭제에 성공했습니다.',
      data: card,
    };
    return response;
  }

  /**
   * 카드 수정 API
   * @param cardId
   * @param updatecardDto
   * @returns
   */
  async updateCard(
    cardId: number,
    updatecardDto: UpdateCardDto,
  ): Promise<ApiResponse<Card>> {
    // Body로 받은 값들 가져오기
    const { title, description, dueDate, color } = updatecardDto;
    // id가 cardId와 일치한 카드 가져오기
    const card = await this.checkCardById(cardId);

    // 카드 없을 때 예외 처리
    if (!card) {
      const errorResponse: ApiResponse<Card> = {
        statusCode: HttpStatus.NOT_FOUND,
        message: '존재하지 않는 카드입니다.',
        error: 'Not Found',
      };
      return errorResponse;
    }

    // 아무 값도 들어오지 않았을 경우 예외 처리
    if (!(title || description || dueDate || color)) {
      const errorResponse: ApiResponse<Card> = {
        statusCode: HttpStatus.BAD_REQUEST,
        message: '입력된 값이 없습니다.',
        error: 'Bad Request',
      };
      return errorResponse;
    }

    // 모든 값들이 다 같을 경우 예외 처리
    if (
      card.title == title &&
      card.description == description &&
      card.dueDate.getTime() == new Date(dueDate).getTime() &&
      card.color == color
    ) {
      const errorResponse: ApiResponse<Card> = {
        statusCode: HttpStatus.BAD_REQUEST,
        message: '변경 사항이 없습니다.',
        error: 'Bad Request',
      };
      return errorResponse;
    }

    // 카드 수정 적용하기
    await this.cardRepository.update({ id: cardId }, updatecardDto);

    // 수정된 카드 가져오기
    const updatedCard = await this.checkCardById(cardId);

    const response: ApiResponse<Card> = {
      statusCode: HttpStatus.OK,
      message: '카드 수정에 성공했습니다.',
      data: updatedCard,
    };
    return response;
  }

  /**
   * 카드 존재 확인
   * @param cardId
   * @returns
   */
  private async checkCardById(cardId: number): Promise<Card> {
    // id가 cardId와 일치한 카드 가져오기
    const card = await this.cardRepository.findOne({
      where: {
        id: cardId,
      },
    });

    return card;
  }
}
