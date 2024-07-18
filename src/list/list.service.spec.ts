import { Test, TestingModule } from '@nestjs/testing';
import { ListService } from './list.service';
import { List } from './entities/list.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CreateListDto } from './dto/create-list.dto';
import { User } from 'src/user/entities/user.entity';
import { LexoRank } from 'lexorank';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUserMemberGuard } from 'src/auth/guards/current-user-member-auth.guard';
import { UpdateOrderDto } from './dto/update-order.dto';

describe('ListService', () => {
  let service: ListService;
  let listRepository: jest.Mocked<Repository<List>>;   //목킹

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ListService,
      {
        provide: getRepositoryToken(List),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            save: jest.fn(),
      },
    },],
    })
    .compile();

    service = module.get<ListService>(ListService);
    listRepository = module.get<Repository<List>>(getRepositoryToken(List)) as jest.Mocked<Repository<List>>;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  //리스트 존재 여부
  describe('existList', () => {
    it('should return list if exists', async () => {
      const listId = 1;
      const list = new List();
      list.listId = listId;

      listRepository.findOne.mockResolvedValue(list);

      const result = await service.existList(listId);
      expect(result).toEqual(list);
    });

    it('should return null if list does not exist', async () => {
      const listId = 1;

      listRepository.findOne.mockResolvedValue(null);

      const result = await service.existList(listId);
      expect(result).toBeNull();
    });
  });

  //리스트 생성
  describe('createList', () => {
    it('should throw BadRequestException if list title already exists', async () => {
      const createListDto: CreateListDto = {
        boardId: 1,
        title: 'Test List1',
      };
      const user = new User();
      const existList = new List();
      existList.title = 'Test List1';
      existList.boardId = 1;

      listRepository.findOne.mockResolvedValue(existList);

      await expect(service.createList(user, createListDto)).rejects.toThrow(BadRequestException);
    });

    it('should create and return a new list with correct rank', async () => {
      const createListDto: CreateListDto = {
        boardId: 1,
        title: 'Test List1',
      };
      const user = new User();
      const newList = new List();
      newList.title = createListDto.title;
      newList.boardId = createListDto.boardId;
      newList.rank = LexoRank.middle().toString();

      listRepository.findOne.mockResolvedValueOnce(null).mockResolvedValueOnce(null); 
      listRepository.save.mockResolvedValue(newList);

      const result = await service.createList(user, createListDto);
      expect(result).toEqual(newList);
      expect(result.rank).toBe(LexoRank.middle().toString());
    });

    it('should create and return a new list with incremented rank', async () => {
      const user = new User();
      const existingList = {
        boardId: 1,
        title: 'Test List1',
        rank: LexoRank.middle().toString()
      } as List;

      const createListDto: CreateListDto = {
        boardId: 1,
        title: 'Test List2',
      };

      const newList = new List();
      newList.boardId = createListDto.boardId;
      newList.title = createListDto.title;
      newList.rank = LexoRank.parse(existingList.rank).genNext().toString();

      listRepository.findOne.mockResolvedValueOnce(null).mockResolvedValueOnce(existingList); 
      listRepository.save.mockResolvedValue(newList);

      const result = await service.createList(user, createListDto);
      expect(result).toEqual(newList);
      expect(result.rank).toBe(LexoRank.parse(existingList.rank).genNext().toString());
    });
  });

  //리스트 순서 이동
  describe('updateListOrder', () => {
    it('should throw BadRequestException if location that cannot be moved', async () => {
      const updateOrderDto: UpdateOrderDto = {
        boardId: 1,
        listId: 2,
        sort: 3
      };

      const user = new User();
      const lists: List[] = [
        { boardId: 1, listId: 1, title: 'List 1', rank: '0|hzzzzr:', createdAt: new Date(), updatedAt: new Date(), board: null, cards: []} as List,
        { boardId: 1, listId: 2, title: 'List 2', rank: '0|hzzzzz:' , createdAt: new Date(), updatedAt: new Date(), board: null, cards: []} as List,
      ];

      
      listRepository.find.mockResolvedValueOnce(lists)

      await expect(service.updateListOrder(user, updateOrderDto)).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException if list does not exist', async () => {
      const updateOrderDto: UpdateOrderDto = {
        boardId: 1,
        listId: 3,
        sort: 1
      };

      const user = new User();
      const lists: List[] = [
        { boardId: 1, listId: 1, title: 'List 1', rank: '0|hzzzzr:', createdAt: new Date(), updatedAt: new Date(), board: null, cards: []} as List,
        { boardId: 1, listId: 2, title: 'List 2', rank: '0|hzzzzz:' , createdAt: new Date(), updatedAt: new Date(), board: null, cards: []} as List,
      ];
      
      listRepository.find.mockResolvedValueOnce(lists)

      await expect(service.updateListOrder(user, updateOrderDto)).rejects.toThrow(NotFoundException);
    });

    it('should update the order of the list - Moving to the beginning', async () => {
      const updateOrderDto: UpdateOrderDto = {
        boardId: 1,
        listId: 2,
        sort: 1
      };

      const user = new User();
      const lists: List[] = [
        { boardId: 1, listId: 1, title: 'List 1', rank: '0|hzzzzr:', createdAt: new Date(), updatedAt: new Date(), board: null, cards: []} as List,
        { boardId: 1, listId: 2, title: 'List 2', rank: '0|hzzzzz:' , createdAt: new Date(), updatedAt: new Date(), board: null, cards: []} as List,
      ];

      listRepository.find.mockResolvedValueOnce(lists);

      const firstList = lists[0];
      const movingList = { ...lists[1] };
      movingList.rank = LexoRank.parse(firstList.rank).genPrev().toString();

      listRepository.save.mockResolvedValueOnce(movingList);
      
      const result = await service.updateListOrder(user, updateOrderDto);

      expect(result).toEqual(movingList);
      expect(result.rank).toBe(LexoRank.parse(firstList.rank).genPrev().toString());
      expect(listRepository.find).toHaveBeenCalledWith({
        where: { boardId: updateOrderDto.boardId },
        order: { rank: 'ASC' },
      });
      expect(listRepository.save).toHaveBeenCalledWith(movingList);
    });

    it('should update the order of the list - Inserting in the middle', async () => {
      const updateOrderDto: UpdateOrderDto = {
        boardId: 1,
        listId: 3,
        sort: 2
      };

      const user = new User();
      const lists: List[] = [
        { boardId: 1, listId: 1, title: 'List 1', rank: '0|hzzzzr:', createdAt: new Date(), updatedAt: new Date(), board: null, cards: []} as List,
        { boardId: 1, listId: 2, title: 'List 2', rank: '0|hzzzzt:' , createdAt: new Date(), updatedAt: new Date(), board: null, cards: []} as List,
        { boardId: 1, listId: 3, title: 'List 3', rank: '0|hzzzzz:' , createdAt: new Date(), updatedAt: new Date(), board: null, cards: []} as List,
      ];

      listRepository.find.mockResolvedValueOnce(lists);

      const beforeList = lists[updateOrderDto.sort-2];
      const afterList = lists[updateOrderDto.sort-1];
      const beforeRank = LexoRank.parse(beforeList.rank);
      const afterRank = LexoRank.parse(afterList.rank);
      const movingList = { ...lists[lists.length-1] };
      movingList.rank = beforeRank.between(afterRank).toString();

      listRepository.save.mockResolvedValueOnce(movingList);
      
      const result = await service.updateListOrder(user, updateOrderDto);

      expect(result).toEqual(movingList);
      expect(result.rank).toBe(beforeRank.between(afterRank).toString());
      expect(listRepository.find).toHaveBeenCalledWith({
        where: { boardId: updateOrderDto.boardId },
        order: { rank: 'ASC' },
      });
      expect(listRepository.save).toHaveBeenCalledWith(movingList);

    });

    it('should update the order of the list - Moving to the end', async () => {
      const updateOrderDto: UpdateOrderDto = {
        boardId: 1,
        listId: 1,
        sort: 2
      };

      const user = new User();
      const lists: List[] = [
        { boardId: 1, listId: 1, title: 'List 1', rank: '0|hzzzzr:', createdAt: new Date(), updatedAt: new Date(), board: null, cards: []} as List,
        { boardId: 1, listId: 2, title: 'List 2', rank: '0|hzzzzz:' , createdAt: new Date(), updatedAt: new Date(), board: null, cards: []} as List,
      ];

      listRepository.find.mockResolvedValueOnce(lists);

      const lastList = lists[lists.length-1];
      const movingList = { ...lists[0] };
      movingList.rank = LexoRank.parse(lastList.rank).genNext().toString();

      listRepository.save.mockResolvedValueOnce(movingList);
      
      const result = await service.updateListOrder(user, updateOrderDto);

      expect(result).toEqual(movingList);
      expect(result.rank).toBe(LexoRank.parse(lastList.rank).genNext().toString());
      expect(listRepository.find).toHaveBeenCalledWith({
        where: { boardId: updateOrderDto.boardId },
        order: { rank: 'ASC' },
      });
      expect(listRepository.save).toHaveBeenCalledWith(movingList);
    });
  });
});
