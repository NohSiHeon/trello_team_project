import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateListDto } from './dto/create-list.dto';
import { List } from './entities/list.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager, QueryFailedError } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { UpdateOrderDto } from './dto/update-order.dto';

import { User } from 'src/user/entities/user.entity';
import { LexoRank } from 'lexorank';

@Injectable()
export class ListService {
  constructor(
    @InjectRepository(List)
    private listRepository: Repository<List>,
    private readonly jwtService: JwtService,
  ) {}

  //리스트 존재 여부

  async existList(id: number) {
    const existList = await this.listRepository.findOne({
      where: { listId: id },
    });

    return existList;
  }

  //리스트 생성

  async createList(user: User, createListDto: CreateListDto) {

    const existList = await this.listRepository.findOne({
      where: { title: createListDto.title },
    });

    if (existList) {
      throw new BadRequestException('이미 존재하는 리스트 명 입니다.');
    }

      //가장 마지막 rank인 list 찾음
      // 0|000000 ~ 0|zzzzzzz
      const highRankList = await this.listRepository.findOne({
        where: {boardId: createListDto.boardId},
        order: { rank: 'DESC'}
      });

      //마지막 rank에 + / rank가 없다면 미들값 세팅
      let newRank: string;
      if(highRankList) {
        const highRank = LexoRank.parse(highRankList.rank);
        newRank = highRank.genNext().toString();
      }else {
        newRank = LexoRank.middle().toString();
      }

      const createNewList = await this.listRepository.save({
        boardId: createListDto.boardId,
        title: createListDto.title,
        rank: newRank,
      });

      return createNewList;
  }

  //리스트 이름 수정

  async updateList(id: number, user: User, createListDto: CreateListDto) {

    const existList = await this.existList(id);
    if (!existList) {
      throw new NotFoundException('존재하지 않는 리스트입니다.');
    }

    const updateList = await this.listRepository.update(
      { listId: id },
      { title: createListDto.title },
    );

    return updateList;
  }

  //리스트 삭제

  async removeList(id: number, user: User) {

    const existList = await this.existList(id);
    if (!existList) {
      throw new NotFoundException('존재하지 않는 리스트입니다.');
    }

    const deleteList = await this.listRepository.delete({ listId: id });

    return deleteList;
  }

  //리스트 조회

  async findAllList(user: User, boardId: number) {

    const findList = await this.listRepository.find({
      where: {boardId: boardId},
      order: { rank: 'ASC'},
      select: {title: true}
    });

    return findList;
  }

  //리스트 순서 이동

  async updateListOrder(user: User, updateOrderDto: UpdateOrderDto) {

    const lists = await this.listRepository.find({
      where: { boardId: updateOrderDto.boardId },
      order: { rank: 'ASC'}
    });

    const listCount = lists.length;
    const newSort = updateOrderDto.sort;

    if(newSort < 0 || newSort > listCount) {
      throw new BadRequestException(
        '이동 불가능 위치 입니다.'
      )
    }
    
    console.log(updateOrderDto.listId);

    const movingList = lists.find((list) => list.listId === updateOrderDto.listId);
    if(!movingList) {
      throw new BadRequestException(
        '리스트가 존재하지 않습니다.'
      )
    };

    let newRank: string;

    //맨 처음으로 가는 경우
    if(newSort === 1) {
      const firstList = lists[0];
      const firstRank = LexoRank.parse(firstList.rank);
      newRank = firstRank.genPrev().toString();
    } else if(newSort === listCount) { //맨 마지막으로 가는 경우
      const lastList = lists[listCount-1];
      const lastRank = LexoRank.parse(lastList.rank);
      newRank = lastRank.genNext().toString();
    } else {  //중간으로 이동
      const beforeList = lists[newSort - 2];
      const afterList = lists[newSort - 1];
      const beforeRank = LexoRank.parse(beforeList.rank);
      const afterRank = LexoRank.parse(afterList.rank);
      newRank = beforeRank.between(afterRank).toString();
    }

    movingList.rank = newRank;
    await this.listRepository.save(movingList);

    return movingList;
  }
}
