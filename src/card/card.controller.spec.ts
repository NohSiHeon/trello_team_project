import { Test, TestingModule } from '@nestjs/testing';
import { CardController } from './card.controller';
import { CardService } from './card.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUserMemberGuard } from 'src/auth/guards/current-user-member-auth.guard';
import { CreateCardDto } from './dtos/create-card.dto';
import { User } from 'src/user/entities/user.entity';
import { CardColor } from './types/card-color.type';
import { LexoRank } from 'lexorank';
import { ApiResponse } from './interfaces/api-response';
import { Card } from './entities/card.entity';
import { HttpStatus } from '@nestjs/common';
import { MemberGuard } from 'src/auth/guards/member-auth.guard';
import { UpdateAssigneeDto } from './dtos/update-assignee.dto';
import { Assignee } from './entities/assignee.entity';
import { UpdateCardOrderDto } from './dtos/update-card-order.dto';

describe('CardController', () => {
  let controller: CardController;
  let service: CardService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CardController],
      providers: [
        {
          provide: CardService,
          useValue: {
            createCard: jest.fn(),    //모의 객체 주입
            updateAssignee: jest.fn(),
            updateCardOrder: jest.fn(),
          },
        },  
      ],
    })
    .overrideGuard(JwtAuthGuard) 
    .useValue({
      canActivate: jest.fn(() => true),    //모의 가드 주입
    })
    .overrideGuard(CurrentUserMemberGuard) 
    .useValue({
      canActivate: jest.fn(() => true),    //모의 가드 주입
    })
    .overrideGuard(MemberGuard)
    .useValue({
      canActivate: jest.fn(() => true),    //모의 가드 주입
    }).compile();

    controller = module.get<CardController>(CardController);
    service = module.get<CardService>(CardService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  //카드 생성
  describe('createCard test', () => {
    it('should create a card', async () => {
      const user: User = { id: 1 } as User;
      const createCardDto: CreateCardDto = { listId: 1, boardId: 1, title: 'Test Card', description: 
        'Test Des', dueDate: new Date(), color: CardColor.Red
      };
      
      const createdCard: Card = {
        id: 1,
        listId: createCardDto.listId,
        title: createCardDto.title,
        description: createCardDto.description,
        color: createCardDto.color,
        rank: LexoRank.middle().toString(),
        createdAt: new Date(),
        updatedAt: new Date(),
        list: null,
        comments: [],
        assignees: [],
        setRank: jest.fn(),
      } as Card;

      const result: ApiResponse<Card> = {
        statusCode: HttpStatus.CREATED,
        message: '카드 생성에 성공했습니다.',
        data: createdCard,
      };

      jest.spyOn(service, 'createCard').mockResolvedValue(result);

      const response = await controller.createCard(user, createCardDto);

      expect(response).toEqual(result);
      expect(service.createCard).toHaveBeenCalledWith(createCardDto);
    });
  });

  //카드 작업자변경
  describe('updateAssignee test', () => {
    it('should update a card', async () => {
      const user: User = { id: 1 , nickname : 'test nickname'} as User;
      const cardId = 1;
      const updateAssigneeDto: UpdateAssigneeDto = { userId: user.id, boardId: 1 };
      
      const assignee: Assignee = {
        cardId: cardId,
        memberId: updateAssigneeDto.userId,
        card: null,
        member: { id: user.id, user } as any,
      };
      
      const updateCard: Card = {
        id: 1,
        listId: 1,
        title: 'Test title',
        description: 'Test description',
        color: CardColor.Red,
        rank: LexoRank.middle().toString(),
        createdAt: new Date(),
        updatedAt: new Date(),
        list: null,
        comments: [],
        assignees: [assignee],
        setRank: jest.fn(),
      } as Card;

      const userArray = [{ name: user.nickname }];

      const result = {
        statusCode: HttpStatus.OK,
        message: '작업자 수정/할당에 성공했습니다.',
        data: {
          ...updateCard,
          assignees: userArray,
        }
      };
      
      jest.spyOn(service, 'updateAssignee').mockResolvedValue(result);

      const response = await controller.updateAssignee(user, cardId, updateAssigneeDto);

      expect(response).toEqual(result);
      expect(service.updateAssignee).toHaveBeenCalledWith(cardId, updateAssigneeDto);
    });
  });

  //카드 이동
  describe('updateCardOrder test', () => {
    it('should move a card', async () => {
      const user: User = { id: 1 } as User;
      const cardId = 1;
      const updateCardOrderDto: UpdateCardOrderDto = { listId: 2, newOrder: 0 };
      
      const movingCard: Card = {
        id: 1,
        listId: updateCardOrderDto.listId,
        title: 'Test title',
        description: 'Test description',
        color: CardColor.Red,
        rank: LexoRank.middle().toString(),
        createdAt: new Date(),
        updatedAt: new Date(),
        list: null,
        comments: [],
        assignees: [],
        setRank: jest.fn(),
      } as Card;
      
      jest.spyOn(service, 'updateCardOrder').mockResolvedValue(movingCard);

      const response = await controller.updateCardOrder(user, cardId, updateCardOrderDto);

      expect(response).toEqual(movingCard);
      expect(service.updateCardOrder).toHaveBeenCalledWith(cardId, updateCardOrderDto);
    });
  });
});
