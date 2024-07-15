import {
  Controller,
  Get,
  Body,
  Patch,
  Delete,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserInfo } from 'src/util/user-info.decorator';
import { CheckEmailDto } from './dto/check-email.dto';
import { createResponse } from 'src/util/response-util';
import { MESSAGES } from 'src/constants/message.constant';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { User } from './entities/user.entity';

@ApiTags('users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  /**
   * 내 정보 조회
   * @param id
   * @returns
   */
  @Get('me')
  async getProfile(@UserInfo() user: User) {
    const data = await this.userService.findById(user.id);
    return createResponse(HttpStatus.OK, MESSAGES.USERS.READ_ME.SUCCEED, data);
  }

  /**
   * 내 정보 수정
   * @param id
   * @param updateUserDto
   * @returns
   */
  @Patch('me')
  async updateProfile(
    @UserInfo() user: User,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const data = await this.userService.update(user.id, updateUserDto);
    return createResponse(
      HttpStatus.OK,
      MESSAGES.USERS.UPDATE_ME.SUCCEED,
      data,
    );
  }

  /**
   * 회원 탈퇴(내 정보 삭제)
   * @param id
   * @returns
   */
  @Delete('me')
  async deleteUser(@UserInfo() user: User) {
    const data = await this.userService.delete(user.id);
    return createResponse(
      HttpStatus.OK,
      MESSAGES.USERS.DELETE_ACCOUNT.SUCCEED,
      data,
    );
  }

  /**
   * 이메일 가입 여부 확인
   * @returns
   */
  @Get('check-email')
  async checkEmail(@Body() checkEmailDto: CheckEmailDto) {
    const { message, status } =
      await this.userService.checkEmail(checkEmailDto);
    return createResponse(HttpStatus.OK, message, status);
  }
}
