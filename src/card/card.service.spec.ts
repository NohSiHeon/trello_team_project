import { Test, TestingModule } from '@nestjs/testing';
import { CardService } from './card.service';
import { Card } from './entities/card.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Member } from 'src/member/entites/member.entity';
import { Assignee } from './entities/assignee.entity';
import { List } from 'src/list/entities/list.entity';
import { UpdateAssigneeDto } from './dtos/update-assignee.dto';
import { HttpStatus, NotFoundException } from '@nestjs/common';
import { ApiResponse } from './interfaces/api-response';
import { UpdateCardOrderDto } from './dtos/update-card-order.dto';

describe('CardService', () => {
  let service: CardService;
  let cardRepository: jest.Mocked<Repository<Card>>;   //레파지토리 목킹
  let listRepository: jest.Mocked<Repository<List>>;   
  let memberRepository: jest.Mocked<Repository<Member>>;   
  let assigneeRepository: jest.Mocked<Repository<Assignee>>; 

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CardService,
        {
          provide: getRepositoryToken(Card),   //프로바이더 제공
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(List),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Member),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Assignee),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<CardService>(CardService);
    cardRepository = module.get<Repository<Card>>(getRepositoryToken(Card)) as jest.Mocked<Repository<Card>>;
    listRepository = module.get<Repository<List>>(getRepositoryToken(List)) as jest.Mocked<Repository<List>>;
    memberRepository = module.get<Repository<Member>>(getRepositoryToken(Member)) as jest.Mocked<Repository<Member>>;
    assigneeRepository = module.get<Repository<Assignee>>(getRepositoryToken(Assignee)) as jest.Mocked<Repository<Assignee>>;
  });

  //서비스 주입 확인
  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  //작업자 수정 할당
  describe('updateAssignee', () => {

    //작업자가 멤버가 아닌 경우를 체크하는 테스트
  
    it('should throw NotFoundException if assignee is not member', async () => {
      const cardId = 1;
      const updateAssigneeDto: UpdateAssigneeDto = {
        userId: 2,
        boardId: 1,
      }
      
      memberRepository.findOne.mockResolvedValue(null);

      await expect(service.updateAssignee(cardId, updateAssigneeDto)).rejects.toThrow(NotFoundException);
    });

    //카드가 존재하지 않는 경우 테스트

    it('should throw NotFoundException if card does not exist', async () => {
      const cardId = 1;
      const updateAssigneeDto: UpdateAssigneeDto = {
        userId: 2,
        boardId: 1,
      }

      const member = {
        memberId: 2,
        boardId: 1,
      } as Member;

      const expectedResponse: ApiResponse<Card> = {
        statusCode: HttpStatus.NOT_FOUND,
        message: '존재하지 않는 카드입니다.',
        error: 'Not Found',
      };

      memberRepository.findOne.mockResolvedValue(member);
      service['checkCardById'] = jest.fn().mockResolvedValue(null);  //checkCardById 함수 목킹
      
      const result = await service.updateAssignee(cardId, updateAssigneeDto);
      expect(result).toEqual(expectedResponse);
    });
  });

  //카드 이동
  describe('updateCardOrder', () => {

    //리스트가 존재하지 않는 경우 테스트

    it('should throw NotFoundException if list dose not exist', async () => {
      const cardId = 1;
      const updateCardOrderDto: UpdateCardOrderDto = {
        listId: 2,
        newOrder: 1,
      };

      const card = new Card();
      card.id = cardId;
      card.listId = 1;
      card.title = 'Test Card';
      card.description = 'Test Description';
      card.createdAt = new Date();
      card.updatedAt = new Date();
      card.setRank();
      
      cardRepository.findOne.mockResolvedValue(card);
      listRepository.findOne.mockResolvedValue(null);

      await expect(service.updateCardOrder(cardId, updateCardOrderDto)).rejects.toThrow(NotFoundException);
    });

    //카드가 다른 리스트로 이동할 경우 리스트 아이디가 바뀌는지 테스트

    it('should update listid if move the card to different list', async () => {
      const cardId = 1;
      const updateCardOrderDto: UpdateCardOrderDto = {
        listId: 2,
        newOrder: 1,
      };

      const card = new Card();
      card.id = cardId;
      card.listId = 1;
      card.title = 'Test Card';
      card.description = 'Test Description';
      card.createdAt = new Date();
      card.updatedAt = new Date();
      card.setRank();

      const list = new List();
      list.listId = 1; 
      list.cards = [card]; 
      
      cardRepository.findOne.mockResolvedValue(card);
      listRepository.findOne.mockResolvedValue(list);

      await service.updateCardOrder(cardId, updateCardOrderDto);
      expect(card.listId).toBe(updateCardOrderDto.listId);
    });
  });
});
