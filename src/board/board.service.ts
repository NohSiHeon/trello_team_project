import {
  ConflictException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UpdateBoardDto } from './dto/update-board.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Board } from './entities/board.entity';
import { Repository } from 'typeorm';
import { Member } from './entities/member.entity';
import { User } from 'src/user/entities/user.entity';
import { assignmentDto } from './dto/assignment.dto';
import { Card } from 'src/card/entities/card.entity';
import { List } from 'src/list/entities/list.entity';

@Injectable()
export class BoardService {
  constructor(
    @InjectRepository(Board) private boardRepository: Repository<Board>,
    @InjectRepository(Member) private memberRepository: Repository<Member>,
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(List) private listRepository: Repository<List>,
    @InjectRepository(Card) private cardRepository: Repository<Card>,
  ) {}
  async create(userId: number, boardTitle: string) {
    const data = await this.boardRepository.save({
      adminId: userId,
      title: boardTitle,
    });
    await this.memberRepository.save({
      boardId: data.id,
      userId: userId,
    });
    return {
      statusCode: HttpStatus.CREATED,
      message: '보드 생성에 성공했습니다.',
      data: data,
    };
  }

  async findAll(userId: number) {
    const ownBoards = await this.boardRepository.find({
      where: { adminId: userId },
    });
    const invitedBoards = await this.memberRepository.find({
      where: {
        userId: userId,
      },
    });
    const data = { ownBoards, invitedBoards };
    return {
      statusCode: HttpStatus.OK,
      message: '보드 목록 조회에 성공했습니다.',
      data: data,
    };
  }

  async findOne(boardId: number) {
    const allListsInBoard = await this.boardRepository.find({
      where: { id: boardId },
      relations: ['list'],
    });
    return {
      statusCode: HttpStatus.OK,
      message: '보드 상세 조회에 성공했습니다.',
      data: allListsInBoard,
    };
  }

  async update(user: User, boardId: number, updateBoardDto: UpdateBoardDto) {
    const userId = user.id;
    const existedBoard = await this.boardRepository.findOne({
      where: { id: +boardId },
    });
    if (!existedBoard) {
      throw new NotFoundException('보드 정보가 없습니다');
    }
    if (existedBoard.adminId != userId) {
      throw new UnauthorizedException('해당 보드에 수정 권한이 없습니다.');
    }
    await this.boardRepository.update(
      { id: +existedBoard.id },
      {
        title: updateBoardDto.title,
        backgroundColor: updateBoardDto.backgroundColor,
      },
    );
    const updatedData = await this.boardRepository.findOne({
      where: { id: +boardId },
    });
    return {
      statusCode: HttpStatus.ACCEPTED,
      message: '보드 수정에 성공했습니다',
      data: updatedData,
    };
  }

  async remove(id: number) {
    const existedBoard = await this.boardRepository.findOne({
      where: { id: +id },
    });
    if (!existedBoard) {
      throw new NotFoundException('보드 정보가 없습니다');
    }
    await this.boardRepository.delete({
      id: +existedBoard.id,
    });
    return {
      statusCode: HttpStatus.OK,
      message: '보드 삭제에 성공했습니다.',
      data: id,
    };
  }

  async inviteMember(adminId: number, boardId: number, email: assignmentDto) {
    const boardData = await this.boardRepository.findOne({
      where: { id: boardId },
    });
    if (boardData.id != adminId) {
      throw new UnauthorizedException('초대 권한이 없습니다');
    }
    const Email = email.email;
    const existedUser = await this.userRepository.findOne({
      where: { email: Email },
    });
    if (!existedUser) {
      throw new NotFoundException('초대하려는 사용자를 찾을 수 없습니다.');
    }
    const inviteInfo = await this.memberRepository.find({
      where: { boardId: boardId, userId: existedUser.id },
    });
    if (inviteInfo) {
      throw new ConflictException('이미 보드에 초대된 사용자입니다.');
    }

    const inviteMember = await this.memberRepository.save({
      boardId: boardId,
      userId: existedUser.id,
    });
    return {
      statusCode: HttpStatus.CREATED,
      message: '보드 초대가 완료되었습니다.',
      data: inviteMember,
    };
  }
}
