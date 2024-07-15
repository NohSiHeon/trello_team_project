import { PickType } from '@nestjs/swagger';
import { User } from '../entities/user.entity';

export class CheckEmailDto extends PickType(User, ['email']) {}
