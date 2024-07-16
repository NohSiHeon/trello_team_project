import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './entities/comment.entity';
import { Card } from 'src/card/entities/card.entity';
import { number } from 'joi';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
    @InjectRepository(Card)
    private readonly cardRepository: Repository<Card>,
  ) {} // DB 가져오기

  // 댓글 생성
  async create(createCommentDto: CreateCommentDto) {
    const { card_id, ...commentData } = createCommentDto;

    const card = await this.cardCheck(card_id);

    // Comment 엔티티 생성 및 저장
    const comment = this.commentRepository.create({
      ...commentData,
      card, // card 엔티티를 직접 설정
    });

    const data = await this.commentRepository.save(comment);
    return data;
  }

  // 댓글 상세 조회
  async findOne(commetId: number) {
    const idCheck = await this.findCommentId(commetId);
    return idCheck;
  }

  // 댓글 수정
  async update(id: number, updateCommentDto: UpdateCommentDto) {
    const idCheck = await this.findCommentId(id);

    idCheck.content = updateCommentDto.content;

    return await this.commentRepository.save(idCheck);
  }

  // 댓글 삭제
  async remove(commetId: number) {
    const idCheck = await this.findCommentId(commetId);
    console.log(idCheck);
    await this.commentRepository.delete(commetId);
    console.log(idCheck);
    return { id: idCheck.id };
  }

  //댓글 전체 조회
  async findAll(cardId: number) {
    await this.cardCheck(cardId);

    const data = await this.commentRepository.find({
      relations: ['card'],
      where: { card: { id: cardId } },
    });

    return data;
  }

  //댓글 확인 API
  async findCommentId(commetId: number) {
    const data = await this.commentRepository.findOneBy({ id: commetId });

    if (!data) {
      throw new NotFoundException('존재하지 않는 댓글입니다.');
    }
    return data;
  }

  //카드 확인 API
  async cardCheck(card_id: number) {
    const card = await this.cardRepository.findOneBy({
      id: card_id,
    });

    if (!card) {
      throw new NotFoundException('존재하지 않는 카드입니다.');
    }

    return card;
  }
}
