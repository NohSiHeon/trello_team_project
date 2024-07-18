import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Member } from 'src/member/entites/member.entity';
import { Board } from 'src/board/entities/board.entity';
import { DataSource, QueryRunner, Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { BackgroundColorTypes } from 'src/board/types/backgroud-color.types';

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;
const createMockRepository = <T = any>(): MockRepository<T> => ({
  findOneBy: jest.fn(),
  find: jest.fn(),
  delete: jest.fn(),
  softDelete: jest.fn(),
});

describe('UserService', () => {
  let userService: UserService;
  let userRepository: MockRepository;
  let memberRepository: MockRepository;
  let boardRepository: MockRepository;
  let dataSource: DataSource;
  let queryRunner: QueryRunner;

  beforeEach(async () => {
    userRepository = createMockRepository();
    memberRepository = createMockRepository();
    boardRepository = createMockRepository();

    queryRunner = {
      connect: jest.fn(),
      startTransaction: jest.fn(),
      commitTransaction: jest.fn(),
      rollbackTransaction: jest.fn(),
      release: jest.fn(),
      manager: {
        find: jest.fn(),
        delete: jest.fn(),
        softDelete: jest.fn(),
      },
    } as any;

    dataSource = {
      createQueryRunner: jest.fn().mockReturnValue(queryRunner),
    } as any;
    jest.spyOn(dataSource, 'createQueryRunner').mockReturnValue(queryRunner);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: getRepositoryToken(User), useValue: userRepository },
        { provide: getRepositoryToken(Member), useValue: memberRepository },
        { provide: getRepositoryToken(Board), useValue: boardRepository },
        { provide: DataSource, useValue: dataSource },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
  });

  describe('deleteUser', () => {
    const userId = 1;
    const board = {
      id: 1,
      adminId: 1,
      title: 'title',
      backgroundColor: BackgroundColorTypes.Red,
    };

    const member = {
      id: 1,
      userId: 2,
      boardId: 1,
    };

    it('should throw NotFoundException if user does not exist', async () => {
      // Given
      userRepository.findOneBy.mockResolvedValue(null);

      // When & Then
      await expect(userService.delete(userId)).rejects.toThrow(
        NotFoundException,
      );
      expect(userRepository.findOneBy).toHaveBeenCalledWith({ id: userId });
    });

    it('should throw NotFoundException if user is an admin with members in boards', async () => {
      // Given
      userRepository.findOneBy.mockResolvedValue({ id: userId });

      (queryRunner.manager.find as jest.Mock)
        .mockResolvedValueOnce([board])
        .mockResolvedValueOnce([member]);

      // When & Then
      await expect(userService.delete(userId)).rejects.toThrow(
        NotFoundException,
      );
      expect(queryRunner.manager.find).toHaveBeenCalledTimes(2);
    });

    it('should delete user successful', async () => {
      // Given
      userRepository.findOneBy.mockResolvedValue({ id: userId });
      (queryRunner.manager.find as jest.Mock)
        .mockResolvedValueOnce([board])
        .mockResolvedValueOnce([]);
      (queryRunner.manager.find as jest.Mock).mockResolvedValueOnce([
        { memberId: 1 },
      ]);

      // When
      await userService.delete(userId);

      // Then
      expect(queryRunner.manager.delete).toHaveBeenCalledWith(Member, {
        memberId: 1,
      });
      expect(queryRunner.manager.delete).toHaveBeenCalledWith(Board, {
        id: 1,
      });
      expect(queryRunner.manager.softDelete).toHaveBeenCalledWith(User, {
        id: userId,
      });
      expect(queryRunner.commitTransaction).toHaveBeenCalled();
    });

    it('should rollback transaction if error', async () => {
      // Given
      userRepository.findOneBy.mockResolvedValue({ id: userId });
      (queryRunner.manager.find as jest.Mock)
        .mockResolvedValueOnce([board])
        .mockResolvedValueOnce([]);

      (queryRunner.manager.find as jest.Mock).mockResolvedValueOnce([member]);
      (queryRunner.manager.delete as jest.Mock).mockRejectedValue(
        new Error('error'),
      );

      // When & Then
      await expect(userService.delete(userId)).rejects.toThrow(Error);
      expect(queryRunner.rollbackTransaction).toHaveBeenCalled();
    });
  });
});
