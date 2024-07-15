import { Test, TestingModule } from '@nestjs/testing';
import { AssigneeController } from './assignee.controller';

describe('AssigneeController', () => {
  let controller: AssigneeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AssigneeController],
    }).compile();

    controller = module.get<AssigneeController>(AssigneeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
