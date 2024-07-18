import {
  Injectable,
  CanActivate,
  ExecutionContext,
  NotFoundException,
} from '@nestjs/common';
import { MESSAGES } from 'src/constants/message.constant';
import { MemberService } from 'src/member/member.service';

@Injectable()
export class CurrentUserMemberGuard implements CanActivate {
  constructor(private readonly memberservice: MemberService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const userId = request.user?.id;
    let { boardId } = request.body;
    if (request?.query?.boardId) boardId = request.query.boardId;

    if (!userId) {
      throw new NotFoundException(MESSAGES.AUTH.COMMON.MEMBER.NO_USER);
    }

    if (!boardId) {
      throw new NotFoundException(MESSAGES.AUTH.COMMON.MEMBER.NO_BOARD);
    }

    const member = await this.memberservice.validateMember(boardId, userId);
    if (!member) {
      throw new NotFoundException(MESSAGES.BOARD.COMMON.NOT_MEMBER);
    }
    return member ? true : false;
  }
}
