import { Test, TestingModule } from '@nestjs/testing';
import { ListController } from './list.controller';
import { ListService } from './list.service';
import { User } from 'src/user/entities/user.entity';
import { CreateListDto } from './dto/create-list.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Card } from 'src/card/entities/card.entity';
import { UpdateOrderDto } from './dto/update-order.dto';
import { CurrentUserMemberGuard } from 'src/auth/guards/current-user-member-auth.guard';

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
    .overrideGuard(CurrentUserMemberGuard) 
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

  //리스트 생성
  describe('createList test', () => {
    it('should create a list', async () => {
      const user: User = { id: 1 } as User;
      const createListDto: CreateListDto = { boardId: 1, title: 'Test List' };
      const result= {
        listId: 1,
        boardId: createListDto.boardId,
        title: createListDto.title,
        rank: '0|hzzzzr',
        createdAt: new Date(),
        updatedAt: new Date(),
        board: null,
        cards: [],
      };

      jest.spyOn(service, 'createList').mockResolvedValue(result);

      const response = await controller.createList(user, createListDto);

      expect(response).toEqual(result);
      expect(service.createList).toHaveBeenCalledWith(user, createListDto);
    });
  });

  //리스트 순서 업데이트
  describe('updateListOrder test', () => {
    it('should update order a list', async () => {
      const user: User = { id: 1 } as User;
      const updateListOrder: UpdateOrderDto = { boardId: 1, listId: 2, sort: 1 };
      const result = {
        listId: 2,
        boardId: 1,
        title: 'Test List',
        rank: '0|hzzzzr:',
        createdAt: new Date(),
        updatedAt: new Date(),
        board: null,
        cards: [],
      }

      jest.spyOn(service, 'updateListOrder').mockResolvedValue(result);

      const response = await controller.updateListOrder( user, updateListOrder );

      expect(response).toEqual(result);
      expect(service.updateListOrder).toHaveBeenCalledWith(user , updateListOrder);
    });
  });
});
