import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { CheckEmailDto } from './dto/check-email.dto';
import { DataSource, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { MESSAGES } from 'src/constants/message.constant';
import { UserStatus } from './types/user-status.type';
import _ from 'lodash';
import { Member } from 'src/member/entites/member.entity';
import { Board } from 'src/board/entities/board.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Member)
    private readonly memberRepository: Repository<Member>,
    @InjectRepository(Board)
    private readonly boardRepository: Repository<Board>,
    private dataSource: DataSource,
  ) {}
  async findById(id: number) {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(MESSAGES.USERS.COMMON.NOT_FOUND);
    }

    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const existedUser = await this.userRepository.findOneBy({ id });
    if (!existedUser) {
      throw new NotFoundException(MESSAGES.USERS.COMMON.NOT_FOUND);
    }

    if (_.isEmpty(updateUserDto)) {
      throw new BadRequestException(MESSAGES.USERS.UPDATE_ME.NO_BODY_DATA);
    }

    const email = updateUserDto.email;
    if (email) {
      const existedEmailUser = await this.userRepository.findOne({
        where: { email },
        withDeleted: true,
      });

      // 현재 유저가 동일한 이메일로 변경할 경우
      if (id === existedEmailUser.id) {
        throw new NotFoundException(MESSAGES.USERS.UPDATE_ME.DUPLICATED_EMAIL);
      }

      // 타 유저 이메일과 중복되는 경우
      if (existedEmailUser) {
        throw new NotFoundException(
          MESSAGES.USERS.CHECK_EMAIL_REGISTRATION.REGISTERED,
        );
      }
    }

    const user = await this.userRepository.save({
      ...existedUser,
      ...updateUserDto,
    });

    return user;
  }

  async delete(id: number) {
    const existedUser = await this.userRepository.findOneBy({ id });
    if (!existedUser) {
      throw new NotFoundException(MESSAGES.USERS.COMMON.NOT_FOUND);
    }

    const isExistingAdmin = await this.boardRepository.findOne({
      where: {
        adminId: id,
      },
    });
    if (isExistingAdmin) {
      throw new NotFoundException(
        MESSAGES.USERS.DELETE_ACCOUNT.ADMIN_CANNOT_DELETE,
      );
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const userMembers = await queryRunner.manager.find(Member, {
        where: {
          userId: existedUser.id,
        },
      });

      for (let member of userMembers) {
        await queryRunner.manager.delete(Member, {
          memberId: member.memberId,
        });
      }

      await queryRunner.manager.softDelete(User, { id: existedUser.id });

      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }

    return { id: id };
  }

  async checkEmail({ email }: CheckEmailDto) {
    let message: string;
    let userStatus: UserStatus;

    const existedUser = await this.userRepository.findOne({
      where: { email },
      withDeleted: true,
    });

    //유효한 사용자일 경우(회원가입된 회원인 경우)
    message = MESSAGES.USERS.CHECK_EMAIL_REGISTRATION.REGISTERED;
    userStatus = UserStatus.REGISTERED;

    if (!existedUser) {
      // 사용자가 존재 하지 않는 경우(회원가입 하지 않은 회원)
      message = MESSAGES.USERS.CHECK_EMAIL_REGISTRATION.NOT_REGISTERED;
      userStatus = UserStatus.NOT_REGISTERED;
    } else if (existedUser.deletedAt) {
      // 탈퇴한 사용자인 경우
      message = MESSAGES.USERS.CHECK_EMAIL_REGISTRATION.DEACTIVATED;
      userStatus = UserStatus.DEACTIVATED;
    }

    return { message, status: userStatus };
  }
}
