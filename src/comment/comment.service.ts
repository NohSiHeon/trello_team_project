import {
  ForbiddenException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './entities/comment.entity';
import { Card } from 'src/card/entities/card.entity';
import { User } from 'src/user/entities/user.entity';
import { Member } from 'src/member/entites/member.entity';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
    @InjectRepository(Card)
    private readonly cardRepository: Repository<Card>,
    @InjectRepository(Member)
    private readonly memberRepository: Repository<Member>,
  ) {} // DB 가져오기

  // 댓글 생성
  async create(user: User, createCommentDto: CreateCommentDto) {
    const { cardId, ...commentData } = createCommentDto;

    const card = await this.cardCheck(cardId);

    // 멤버 id 확인
    const member = await this.memberRepository.findOne({
      where: { userId: user.id },
    });

    if (createCommentDto.boardId !== card.list.board.id) {
      throw new NotFoundException('보드 내 해당 리스트 및 카드가 없습니다');
    }

    // Comment 엔티티 생성 및 저장
    const comment = this.commentRepository.create({
      ...commentData,
      card, // card 저장
      member, //member 저장
    });

    let data = await this.commentRepository.save(comment);

    return {
      status: HttpStatus.CREATED,
      message: '댓글 생성에 성공하였습니다.',
      data: {
        userId: member.userId,
        boardId: data.card.list.board.id,
        listId: data.card.list.listId,
        cardId: data.card.id,
        commentId: data.id,
        content: data.content,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      },
    };
  }

  // 댓글 상세 조회
  async findOne(commentId: number, boardId: number) {
    const commentIdCheck = await this.findCommentId(commentId);

    if (boardId !== commentIdCheck.card.list.boardId) {
      throw new NotFoundException('보드 내 해당 리스트 및 카드가 없습니다');
    }

    return {
      status: HttpStatus.OK,
      message: '댓글 상세 조회에 성공하였습니다.',
      data: {
        userId: commentIdCheck.member.userId,
        boardId: commentIdCheck.card.list.boardId,
        listId: commentIdCheck.card.listId,
        cardId: commentIdCheck.card.id,
        commentId: commentIdCheck.id,
        content: commentIdCheck.content,
        createdAt: commentIdCheck.createdAt,
        updatedAt: commentIdCheck.updatedAt,
      },
    };
  }

  // 댓글 수정
  async update(
    commentId: number,
    updateCommentDto: UpdateCommentDto,
    userId: number,
  ) {
    console.log(commentId);
    const commentIdCheck = await this.findCommentId(commentId);

    if (updateCommentDto.boardId !== commentIdCheck.card.list.boardId) {
      throw new NotFoundException('보드 내 해당 리스트 및 카드가 없습니다');
    }

    if (commentIdCheck.member.userId !== userId) {
      throw new ForbiddenException('권한이 없습니다');
    }

    commentIdCheck.content = updateCommentDto.content; // 댓글 업데이트
    await this.commentRepository.save(commentIdCheck); // 저장

    return {
      status: HttpStatus.OK,
      message: '댓글 수정에 성공하였습니다.',
      data: {
        userId: commentIdCheck.member.userId,
        boardId: commentIdCheck.card.list.boardId,
        listId: commentIdCheck.card.listId,
        cardId: commentIdCheck.card.id,
        commentId: commentIdCheck.id,
        content: commentIdCheck.content,
        createdAt: commentIdCheck.createdAt,
        updatedAt: commentIdCheck.updatedAt,
      },
    };
  }

  // 댓글 삭제
  async remove(commentId: number, userId: number, boardId) {
    const commentIdCheck = await this.findCommentId(commentId);

    if (commentIdCheck.member.userId !== userId) {
      throw new ForbiddenException('권한이 없습니다');
    }

    if (boardId !== commentIdCheck.card.list.boardId) {
      throw new NotFoundException('보드 내 해당 리스트 및 카드가 없습니다');
    }

    await this.commentRepository.delete(commentIdCheck.id);

    return {
      status: HttpStatus.OK,
      message: '댓글 삭제에 성공하였습니다.',
      data: { id: commentIdCheck.id },
    };
  }

  //댓글 전체 조회
  async findAll(cardId: number, boardId: number) {
    const card = await this.cardCheck(cardId);

    if (boardId !== card.list.boardId) {
      throw new NotFoundException('보드 내 해당 카드가 없습니다.');
    }

    return {
      status: HttpStatus.OK,
      message: '댓글 전체 조회에 성공하였습니다',
      data: {
        boardId: card.list.boardId,
        boardName: card.list.board.title,
        listId: card.listId,
        listName: card.list.title,
        cardId: card.id,
        cardName: card.title,
        commenet: card.comments,
      },
    };
  }

  //댓글 id 확인 및 릴레이션 API
  async findCommentId(commentId: number) {
    const data = await this.commentRepository.findOne({
      where: { id: commentId },
      relations: ['member', 'member.board', 'card', 'card.list.board'],
    });

    if (!data) {
      throw new NotFoundException(`존재하지 않는 댓글입니다.`);
    }
    return data;
  }

  //카드 id 확인 및 릴레이션 API
  async cardCheck(cardId: number) {
    const card = await this.cardRepository.findOne({
      where: { id: cardId },
      relations: ['list', 'comments', 'list.board'],
    });

    if (!card) {
      throw new NotFoundException('존재하지 않는 카드입니다.');
    }

    return card;
  }

  // //보드 호출 API
  // async listCheck(boardId: number, userId: number, cardId: number) {
  //   const list = await this.listRepository.findOne({
  //     where: { boardId: boardId },
  //   });

  //   const card = await this.cardRepository.findOne({
  //     where: { id: cardId },
  //     // relations: ['list'],
  //     // select: ['id'], // 카드의 ID만 반환
  //   });

  //   if (list.listId !== card.listId) {
  //     throw new NotFoundException('입력한 보드 ID 내에 카드 ID가 없습니다');
  //   }

  //   return true;
  // }
}
