import { IsEmail, IsNotEmpty } from 'class-validator';

export class assignmentDto {
  @IsNotEmpty({ message: '초대하려는 사용자 이메일을 입력해주세요' })
  @IsEmail()
  email: string;
}
