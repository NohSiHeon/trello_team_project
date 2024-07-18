import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { User } from './entities/user.entity';
import { createResponse } from 'src/util/response-util';
import { MESSAGES } from 'src/constants/message.constant';
import { HttpStatus } from '@nestjs/common';

jest.mock('src/util/response-util');

describe('UserController', () => {
  let userController: UserController;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: {
            delete: jest.fn(),
          },
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    userController = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(userController).toBeDefined();
    expect(userService).toBeDefined();
  });

  describe('deleteUser', () => {
    it('deleteUser Method By Successful', async () => {
      // Given
      const user: User = { id: 1 } as User;
      const deletedUserData = { id: user.id };
      const mockCreateResponse = {
        statusCode: HttpStatus.OK,
        message: MESSAGES.USERS.DELETE_ACCOUNT.SUCCEED,
        data: deletedUserData,
      };

      userService.delete = jest.fn().mockResolvedValue(deletedUserData);
      (createResponse as jest.Mock).mockReturnValue(mockCreateResponse);

      // When
      const response = await userController.deleteUser(user);

      // Then
      expect(userService.delete).toHaveBeenCalledWith(user.id);
      expect(createResponse).toHaveBeenCalledWith(
        HttpStatus.OK,
        MESSAGES.USERS.DELETE_ACCOUNT.SUCCEED,
        deletedUserData,
      );
      expect(response).toEqual(mockCreateResponse);
    });
  });
});
