import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './entities/comment.entity';
import { NotFoundError } from 'rxjs';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
  ) {} // DB 가져오기

  // 댓글 생성
  async create(createCommentDto: CreateCommentDto) {
    //cardId: number, 합치고 추가
    //카드 존재 확인 코드
    // const card = await this.commentRepository.findOne({
    //   where: { card: { id: cardId } },
    //   relations: ['card'],
    // });
    // if (!card) {
    //   throw new NotFoundException('존재하지 않는 카드입니다.');
    // }

    const data = await this.commentRepository.save(createCommentDto);
    return data;
  }

  // 댓글 조회
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

  //댓글 ID 확인 API
  async findCommentId(commetId: number) {
    const data = await this.commentRepository.findOneBy({ id: commetId });

    if (!data) {
      throw new NotFoundException('존재하지 않는 댓글입니다.');
    }
    return data;
  }
}
