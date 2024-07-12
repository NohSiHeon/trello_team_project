import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';
import { MESSAGES } from 'src/constants/message.constant';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  async signUp(signUpDto: SignUpDto) {
    const { email, password, passwordConfirm } = signUpDto;

    if (password !== passwordConfirm) {
      throw new BadRequestException(
        MESSAGES.AUTH.COMMON.PASSWORD_CONFIRM.NOT_MATCHED_WITH_PASSWORD,
      );
    }

    const existedUser = await this.userRepository.findOneBy({ email });
    if (existedUser) {
      throw new ConflictException(MESSAGES.AUTH.COMMON.DUPLICATED);
    }

    const hashRound: number = this.configService.get<number>(
      'PASSWORD_HASH_ROUND',
    );
    const hasedPassword = bcrypt.hashSync(password, +hashRound);

    delete signUpDto.passwordConfirm;
    const user = await this.userRepository.save({
      ...signUpDto,
      password: hasedPassword,
    });

    const accessToken = this.signIn(user.id);
    return accessToken;
  }

  async validateUser({ email, password }: SignInDto) {
    const user = await this.userRepository.findOne({
      where: { email },
      select: { id: true, password: true },
    });

    if (!user) {
      throw new UnauthorizedException(MESSAGES.AUTH.COMMON.UNAUTHORIZED);
    }

    if (!bcrypt.compareSync(password, user.password)) {
      throw new UnauthorizedException(MESSAGES.AUTH.COMMON.UNAUTHORIZED);
    }

    return {
      id: user.id,
    };
  }

  signIn(id: number) {
    const payload = { id };
    const accessToken = this.jwtService.sign(payload);

    return {
      accessToken,
    };
  }
}
