import { IsEmail, IsOptional, IsString, Validate } from 'class-validator';
import { IsPhoneNumberConstraint } from '../decorators/is-phone-number.decorator';
import { MESSAGES } from 'src/constants/message.constant';

export class UpdateUserDto {
  /**
   * 전화번호
   * @example "gildong00@gmail.com"
   */
  @IsOptional()
  @IsEmail({}, { message: MESSAGES.AUTH.COMMON.EMAIL.INVALID_FORMAT })
  email?: string;

  /**
   * 이름
   * @example "홍길동"
   */
  @IsOptional()
  @IsString()
  name?: string;

  /**
   * 닉네임
   * @example "길똥"
   */
  @IsOptional()
  @IsString()
  nickname?: string;

  /**
   * 전화번호
   * @example "010-0000-0000"
   */
  @IsOptional()
  @Validate(IsPhoneNumberConstraint)
  phoneNumber?: string;
}
