import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateListDto } from './dto/create-list.dto';
import { List } from './entities/list.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager, QueryFailedError} from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { ListOrder } from './entities/listOrder.entity';

@Injectable()
export class ListService {
  constructor(
    @InjectRepository(List)
    private listRepository: Repository<List>,
    @InjectRepository(ListOrder)
    private listOrderRepository: Repository<ListOrder>,
    private entityManager: EntityManager,
    //private readonly jwtService: JwtService,
  ) {}

  //리스트 존재 여부

  async existList(id: number) {

    const existList = await this.listRepository.findOne({
      where: {listId: id}
    });

    return existList;
  };
  
  //리스트 생성

  async createList(id: number, createListDto: CreateListDto) {

    const existList = await this.listRepository.findOne({
      where: {title: createListDto.title}
    });
    
    if(existList) {
      throw new BadRequestException(
        '이미 존재하는 리스트 명 입니다.'
      )
    };

    //트랜잭션 ( 리스트 추가, 리스트 오더 배열 추가)
    return await this.entityManager.transaction(async (manager) => {

      const createNewList = await manager.save(List,{
        boardId: id,
        title: createListDto.title,
      });

      let listOrder = await manager.findOne(ListOrder, {
        where: { boardId: id },
      });

      if (!listOrder) {
        await manager.save(ListOrder, {
          boardId: id,
          listOrder: [createNewList.listId],
        });
      } else {
        listOrder.listOrder.push(createNewList.listId);
        await manager.save(ListOrder);
      }
      
      return createNewList;
    });
  };

  //리스트 이름 수정

  async updateList(id: number, createListDto: CreateListDto) {

    const existList = this.existList(id);
    if(!existList) {
      throw new BadRequestException(
        '존재하지 않는 리스트입니다.'
      )
    };

    const updateList = await this.listRepository.update(
      {listId: id},
      {title: createListDto.title}
    );

    return updateList;
  }

  //리스트 삭제

  async removeList(id: number) {

    const existList = this.existList(id);
    if(!existList) {
      throw new BadRequestException(
        '존재하지 않는 리스트입니다.'
      )
    };

    const deleteList = await this.listRepository.delete(
      {listId: id}
    );

    return deleteList;
  };

  //리스트 순서 이동

  async updateListOrder(id: number) {

    const existList = this.existList(id);
    if(!existList) {
      throw new BadRequestException(
        '존재하지 않는 리스트입니다.'
      )
    };

  };

  // findAll() {
  //   return `This action returns all list`;
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} list`;
  // }
}
