import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { CheckEmailDto } from './dto/check-email.dto';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { MESSAGES } from 'src/constants/message.constant';
import { UserStatus } from './types/user-status.type';
import _ from 'lodash';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
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

    const user = await this.userRepository.softDelete({ id });
    // TODO : 추후 Admin User 관련 처리 및 연관관계 처리
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
