import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCardDto } from './dtos/create-card.dto';
import { Card } from './entities/card.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ApiResponse } from './interfaces/api-response';
import { UpdateCardDto } from './dtos/update-card.dto';
import { List } from 'src/list/entities/list.entity';
import { UpdateAssigneeDto } from './dtos/update-assignee.dto';
import { Member } from 'src/member/entites/member.entity';
import { Assignee } from 'src/card/entities/assignee.entity';
import { UpdateCardOrderDto } from './dtos/update-card-order.dto';
import { LexoRank } from 'lexorank';

@Injectable()
export class CardService {
  constructor(
    @InjectRepository(Card)
    private cardRepository: Repository<Card>,
    @InjectRepository(List)
    private listRepository: Repository<List>,
    @InjectRepository(Member)
    private memberRepository: Repository<Member>,
    @InjectRepository(Assignee)
    private assigneeRepository: Repository<Assignee>,
    // @InjectRepository(User)
    // private userRepository: Repository<User>,
  ) {}

  /**
   * 카드 생성 API
   * @param createCardDto
   * @returns
   */
  async createCard(createCardDto: CreateCardDto): Promise<ApiResponse<Card>> {
    const { listId } = createCardDto;

    // 리스트 조회
    const list = await this.listRepository.findOne({
      where: {
        listId: listId,
      },
    });
    // 리스트 존재 여부 예외 처리
    if (!list) {
      const errorResponse: ApiResponse<Card> = {
        statusCode: HttpStatus.NOT_FOUND,
        message: '존재 하지 않는 리스트입니다.',
        error: 'Not Found',
      };
      return errorResponse;
    }

    //
    const cards = await this.cardRepository.find({
      where: { listId },
      order: { rank: 'ASC' },
    });

    let rank: string;
    if (cards.length === 0) {
      // 카드가 처음 생길 경우 초기값 설정
      rank = LexoRank.middle().toString();
    } else {
      // 마지막 카드보다 다음 순서로 설정

      rank = LexoRank.parse(cards[cards.length - 1].rank)
        .genNext()
        .toString();
    }

    const card = this.cardRepository.create(createCardDto);
    // 카드 rank에 rank 할당
    card.rank = rank;

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
  async getAllCards(listId: number): Promise<ApiResponse<Card[]>> {
    // 카드 전부 가져오기
    const card = await this.cardRepository.find({ where: { listId } });

    // 반환값
    const response: ApiResponse<Card[]> = {
      statusCode: HttpStatus.OK,
      message: '카드 조회에 성공했습니다.',
      data: card,
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
    await this.cardRepository.update(
      { id: cardId },
      { title, description, dueDate, color },
    );

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
   * 작업자 수정/할당
   * @param cardId
   * @param updateAssigneeDto
   * @returns
   */
  async updateAssignee(cardId: number, updateAssigneeDto: UpdateAssigneeDto) {
    const { userId, boardId } = updateAssigneeDto;

    // 멤버 조회
    const member = await this.memberRepository.findOne({
      where: {
        userId,
        boardId,
      },
    });

    // 멤버가 아닐경우 예외 처리
    if (!member) {
      throw new NotFoundException('멤버가 아닙니다.');
    }

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

    // 멤버의 memberId 값
    const memberId = member.memberId;

    // 작업자 할당
    await this.assigneeRepository.save({ cardId, memberId });

    // 카드의 id가 cardId인 카드와 assignees 값 조회하기
    const updatedCard = await this.cardRepository.findOne({
      where: { id: cardId },
      relations: ['assignees'],
    });

    // 가져온 카드에 포함인 assignee
    const assignees = updatedCard.assignees;

    // 빈 배열 생성
    const userArray = [];

    // assignees 순회
    for (let assignee of assignees) {
      // member에 memberId가 assignee의 memberId인 멤버와 user 조회하기
      const member = this.memberRepository.findOne({
        where: {
          memberId: assignee.memberId,
        },
        relations: ['user'],
      });
      // 배열에 assginees를 순회해서 나온 user의 nickname을 name key로 추가
      userArray.push({ name: (await member).user.nickname });
    }

    // assignees key에 userArray를 value로 할당
    const data = {
      ...updatedCard,
      assignees: userArray,
    };

    const response = {
      statusCode: HttpStatus.OK,
      message: '작업자 수정/할당에 성공했습니다.',
      data: data,
    };

    return response;
  }

  /**
   * 카드 이동
   * @param cardId
   * @param updateCardOrderDto
   * @returns
   */
  async updateCardOrder(
    cardId: number,
    updateCardOrderDto: UpdateCardOrderDto,
  ) {
    const { listId, newOrder } = updateCardOrderDto;

    // 이동할 카드가 있는지 확인하는데 list도 relation으로 가져오기
    const card = await this.cardRepository.findOne({
      where: { id: cardId },
    });

    // 카드가 없을 경우 예외 처리
    if (!card) {
      throw new NotFoundException('없는 카드입니다.');
    }

    // 이동할 리스트 조회
    const list = await this.listRepository.findOne({
      where: { listId: listId },
      relations: ['cards'],
    });

    // 리스트 없을 경우 예외 처리
    if (!list) {
      throw new NotFoundException('없는 리스트입니다.');
    }

    // 카드가 다른 리스트로 이동할 경우 리스트 변경
    if (card.listId !== listId) {
      card.listId = listId;
      list.cards.push(card);
    }

    // 이동할 리스트의 카드를 rank 순서대로 정렬
    const cardsOnList = list.cards.sort((a, b) =>
      LexoRank.parse(a.rank).compareTo(LexoRank.parse(b.rank)),
    );

    // 옮겨지는 카드 삭제
    cardsOnList.splice(
      cardsOnList.findIndex((card) => card.id === cardId),
      1,
    );

    // 새로운 위치에 카드 추가
    cardsOnList.splice(newOrder, 0, card);

    //카드 rank 재조정
    for (let i = 0; i < cardsOnList.length; i++) {
      const prevRank = i === 0 ? null : LexoRank.parse(cardsOnList[i - 1].rank);
      const nextRank =
        i >= cardsOnList.length - 1
          ? null
          : LexoRank.parse(cardsOnList[i + 1].rank);

      if (prevRank && nextRank) {
        // 두 값이 다 있을 경우 prev, next 사이에 값 넣기
        cardsOnList[i].rank = prevRank.between(nextRank).toString();
      } else if (prevRank) {
        // prev 값만 있을 경우 prev 뒤에 값 넣기
        cardsOnList[i].rank = prevRank.genNext().toString();
      } else if (nextRank) {
        // next 값만 있을 경우 next 전에 값 넣기
        cardsOnList[i].rank = nextRank.genPrev().toString();
      } else {
        // prev, next 둘 다 없을 경우 기본 값 넣기
        cardsOnList[i].rank = LexoRank.middle().toString();
      }

      // 카드 저장
      await this.cardRepository.save(cardsOnList[i]);
    }
    return card;
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
