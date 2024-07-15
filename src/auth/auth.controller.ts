import {
  Controller,
  Post,
  Body,
  HttpStatus,
  UseGuards,
  HttpCode,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/sign-up.dto';
import { createResponse } from 'src/util/response-util';
import { MESSAGES } from 'src/constants/message.constant';
import { UserInfo } from 'src/util/user-info.decorator';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { ApiTags } from '@nestjs/swagger';
import { SignInDto } from './dto/sign-in.dto';
import { User } from 'src/user/entities/user.entity';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * 회원가입
   * @param signUpDto
   * @returns
   */
  @Post('/sign-up')
  async SignUp(@Body() signUpDto: SignUpDto) {
    const data = await this.authService.signUp(signUpDto);
    return createResponse(
      HttpStatus.CREATED,
      MESSAGES.AUTH.SIGN_UP.SECCEED,
      data,
    );
  }

  /**
   * 로그인
   * @param signUpDto
   * @returns
   */
  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  @Post('sign-in')
  async SignIn(@UserInfo() user: User, @Body() signInDto: SignInDto) {
    const data = await this.authService.signIn(user.id);
    return createResponse(
      HttpStatus.ACCEPTED,
      MESSAGES.AUTH.SIGN_IN.SECCEED,
      data,
    );
  }
}
