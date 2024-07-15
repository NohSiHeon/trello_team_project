import { Test, TestingModule } from '@nestjs/testing';
import { ListController } from './list.controller';
import { ListService } from './list.service';
import { User } from 'src/user/entities/user.entity';
import { CreateListDto } from './dto/create-list.dto';
import { List } from './entities/list.entity';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { FindListDto } from './dto/find-list.dto';

describe('ListController', () => {
  let controller: ListController;
  let service: ListService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ListController],
      providers: [
        {
          provide: ListService,
          useValue: {
            createList: jest.fn(),    //모의 객체 주입
            findAllList: jest.fn(),
            updateListOrder: jest.fn(),
            updateList: jest.fn(),
            removeList: jest.fn()
          },
        },  
      ],
    })
    .overrideGuard(JwtAuthGuard) 
    .useValue({
      canActivate: jest.fn(() => true),    //모의 가드 주입
    })
    .compile();

    controller = module.get<ListController>(ListController);
    service = module.get<ListService>(ListService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('CreateList test', () => {
    it('should create a list', async () => {
      const user: User = { id: 1 } as User;
      const createListDto: CreateListDto = { boardId: 1, title: 'Test List' };
      const result= {
        listId: 1,
        boardId: createListDto.boardId,
        title: createListDto.title,
        createdAt: new Date(),
        updatedAt: new Date(),
        board: null, 
        cardOrder: null, 
        cards: [],
      };

      jest.spyOn(service, 'createList').mockResolvedValue(result);

      const response = await controller.createList(user, createListDto);

      expect(response).toEqual(result);
      expect(service.createList).toHaveBeenCalledWith(user, createListDto);
    });
  });

  describe('findAllList test', () => {
    it('should get a list', async () => {
      const user: User = { id: 1 } as User;
      const findListDto: FindListDto = { boardId: 1 };
      const result= {
        title: 'Done',
      };

      jest.spyOn(service, 'findAllList').mockResolvedValue(result);

      const response = await controller.findAllList( user, findListDto);

      expect(response).toEqual(result);
      expect(service.findAllList).toHaveBeenCalledWith(user, findListDto);
    });
  });

  describe('removeList test', () => {
    it('should remove a list', async () => {
      const user: User = { id: 1 } as User;
      const listId = '1';

      jest.spyOn(service, 'removeList').mockResolvedValue(undefined);

      const response = await controller.removeList( listId, user );

      expect(response).toBeUndefined();
      expect(service.removeList).toHaveBeenCalledWith(+listId, user);
    });
  });
});
