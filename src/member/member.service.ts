import { InjectRepository } from '@nestjs/typeorm';
import { Member } from './entites/member.entity';

import { Repository } from 'typeorm';

import { Injectable } from '@nestjs/common';

@Injectable()
export class MemberService {
  constructor(
    // @InjectRepository(User)
    // private userRepository: Repository<User>,
    // @InjectRepository(Board)
    // private boardRepository: Repository<Board>,
    @InjectRepository(Member)
    private memberRepository: Repository<Member>,
  ) {}
  async validateMember(boardId: number, userId: number) {
    const member = this.memberRepository.findOne({
      where: {
        userId,
        boardId,
      },
    });

    return member ? member : null;
  }
}
