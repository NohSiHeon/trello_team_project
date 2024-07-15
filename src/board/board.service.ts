import {
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
import { CheckEmailDto } from 'src/user/dto/check-email.dto';
import { assignmentDto } from './dto/assignment.dto';

@Injectable()
export class BoardService {
  constructor(
    @InjectRepository(Board) private boardRepository: Repository<Board>,
    @InjectRepository(Member) private memberRepository: Repository<Member>,
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}
  async create(userId: number, boardTitle: string) {
    const data = await this.boardRepository.save({
      adminId: userId,
      title: boardTitle,
    });
    return data;
  }

  async findAll(userId: number) {
    const ownBoards = await this.boardRepository.find({
      where: { adminId: userId },
    });
    const assignedBoards = await this.memberRepository.find({
      where: {
        userId: userId,
      },
    });
    const data = { ownBoards, assignedBoards };
    return data;
  }

  findOne(id: number) {
    return `This action returns a #${id} board`;
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
    const updateUser = await this.boardRepository.update(
      { id: +existedBoard.id },
      {
        title: updateBoardDto.title,
        backgroundColor: updateBoardDto.backgroundColor,
      },
    );
    return updateUser;
  }

  async remove(id: number) {
    const existedBoard = await this.boardRepository.findOne({
      where: { id: +id },
    });
    if (!existedBoard) {
      throw new NotFoundException('보드 정보가 없습니다');
    }
    const removeUser = await this.boardRepository.delete({
      id: +existedBoard.id,
    });
    return removeUser;
  }

  async inviteMember(adminId: number, boardId: number, email: assignmentDto) {
    const boardData = await this.boardRepository.findOne({
      where: { id: boardId },
    });
    if (boardData.id != adminId) {
      throw new UnauthorizedException('초대 권한이 없습니다');
    }
    const assignInfo = await this.memberRepository.find({
      where: { boardId: boardId },
    });
    const Email = email.email;
    const existedUser = await this.userRepository.findOne({
      where: { email: Email },
    });
    return 'assigned';
  }
}
