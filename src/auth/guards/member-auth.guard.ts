import {
  Injectable,
  CanActivate,
  ExecutionContext,
  NotFoundException,
} from '@nestjs/common';
import { MESSAGES } from 'src/constants/message.constant';
import { MemberService } from 'src/member/member.service';

@Injectable()
export class MemberGuard implements CanActivate {
  constructor(private readonly memberservice: MemberService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const { userId, boardId } = request.body;

    const member = await this.memberservice.validateMember(boardId, userId);
    if (!member) {
      throw new NotFoundException(MESSAGES.BOARD.COMMON.NOT_MEMBER);
    }
    return member ? true : false;
  }
}
