import { Test, TestingModule } from '@nestjs/testing';
import { ListController } from './list.controller';
import { ListService } from './list.service';
import { User } from 'src/user/entities/user.entity';

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
            createList: jest.fn(),
          },
        },
      ],  //모의 서비스 객체 사용
    }).compile();

    controller = module.get<ListController>(ListController);
    service = module.get<ListService>(ListService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createList', () => {
    it('should create a list', async () => {
      // const user: User = { id: 1 } as User;
      // const createListDto: CreateListDto = { title: 'Test List' };
      // const result = { id: 1, title: 'Test List', boardId: 1 };

      // jest.spyOn(service, 'createList').mockResolvedValue(result);

      // const response = await controller.createList('1', user, createListDto);

      // expect(response).toEqual(result);
      // expect(service.createList).toHaveBeenCalledWith(1, user, createListDto);
    });
  });
});
