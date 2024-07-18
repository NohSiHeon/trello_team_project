import { PickType } from '@nestjs/swagger';
import { IsNotEmpty, IsStrongPassword } from 'class-validator';
import { MESSAGES } from 'src/constants/message.constant';
import { User } from 'src/user/entities/user.entity';

export class SignUpDto extends PickType(User, [
  'email',
  'password',
  'name',
  'nickname',
  'phoneNumber',
]) {
  /**
   * 비밀번호 확인
   * @example "Hongil00!@"
   */
  @IsNotEmpty({ message: MESSAGES.AUTH.COMMON.PASSWORD_CONFIRM.REQUIRED })
  @IsStrongPassword(
    {},
    {
      message: MESSAGES.AUTH.COMMON.PASSWORD.INVALID_FORMAT,
    },
  )
  passwordConfirm: string;
}
