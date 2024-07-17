import { Test, TestingModule } from '@nestjs/testing';
import { ListService } from './list.service';
import { List } from './entities/list.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BadRequestException } from '@nestjs/common';
import { CreateListDto } from './dto/create-list.dto';
import { User } from 'src/user/entities/user.entity';
import { LexoRank } from 'lexorank';

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
            findOne: jest.fn(),
            save: jest.fn(),
      },
    },],
    }).compile();

    service = module.get<ListService>(ListService);
    listRepository = module.get<Repository<List>>(getRepositoryToken(List)) as jest.Mocked<Repository<List>>;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

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

  describe('createList', () => {
    it('should throw BadRequestException if list title already exists', async () => {
      const createListDto: CreateListDto = {
        title: 'Test List',
        boardId: 1,
      };
      const user = new User();

      listRepository.findOne.mockResolvedValue(new List());

      await expect(service.createList(user, createListDto)).rejects.toThrow(BadRequestException);
    });

    it('should create and return a new list with correct rank', async () => {
      const createListDto: CreateListDto = {
        title: 'Test List',
        boardId: 1,
      };
      const user = new User();
      const newList = new List();
      newList.title = createListDto.title;
      newList.boardId = createListDto.boardId;
      newList.rank = LexoRank.middle().toString();

      listRepository.findOne
        .mockResolvedValueOnce(null)  // No list with same title
        .mockResolvedValueOnce(null); // No existing list for rank
      listRepository.save.mockResolvedValue(newList);

      const result = await service.createList(user, createListDto);
      expect(result).toEqual(newList);
      expect(result.rank).toBe(LexoRank.middle().toString());
    });

    it('should create and return a new list with incremented rank', async () => {
      const createListDto: CreateListDto = {
        title: 'Test List',
        boardId: 1,
      };
      const user = new User();
      const existingList = new List();
      existingList.rank = LexoRank.middle().toString();
      const newList = new List();
      newList.title = createListDto.title;
      newList.boardId = createListDto.boardId;
      newList.rank = LexoRank.parse(existingList.rank).genNext().toString();

      listRepository.findOne
        .mockResolvedValueOnce(null)  // No list with same title
        .mockResolvedValueOnce(existingList); // Existing list for rank
      listRepository.save.mockResolvedValue(newList);

      const result = await service.createList(user, createListDto);
      expect(result).toEqual(newList);
      expect(result.rank).toBe(LexoRank.parse(existingList.rank).genNext().toString());
    });
  });
});
