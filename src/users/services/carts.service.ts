import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Cart } from '../entities/cart.entity';
import { CreateCartDto } from '../dtos/cart.dto';
import { addOneEntity } from 'src/utils/shared-functions';
import { User } from '../entities/user.entity';
import { relationsCart, selectCart } from 'src/utils/select-relations';

@Injectable()
export class CartsService {
  constructor(
    @InjectRepository(Cart) private cartRepository: Repository<Cart>,
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async getAll() {
    return await this.cartRepository.find({
      relations: relationsCart,
      select: selectCart,
    });
  }

  async getOne(id: number) {
    const cart = await this.cartRepository.findOne({
      where: { id },
      relations: relationsCart,
      select: selectCart,
    });

    if (!cart) {
      throw new NotFoundException('Cart not found');
    }

    return cart;
  }

  async getOneByUser(userId: number) {
    const cart = await this.cartRepository.findOne({
      where: { user: { id: userId } },
      relations: relationsCart,
      select: selectCart,
    });

    if (!cart) {
      throw new NotFoundException('Cart not found');
    }

    return cart;
  }

  async create(payload: CreateCartDto) {
    if (!payload.userId) {
      throw new BadRequestException(
        'You must send an id that belongs to a user',
      );
    }
    const cart = await this.cartRepository.findOne({
      where: { user: { id: payload.userId } },
    });

    if (cart) {
      throw new BadRequestException('A cart already exists for the user');
    }

    const newCart = new Cart();

    if (payload.userId) {
      await addOneEntity(this.userRepository, payload.userId, newCart);
    }

    return await this.cartRepository.save(newCart);
  }

  async delete(id: number) {
    const cart = await this.getOne(id);
    await this.cartRepository.delete(id);
    return cart;
  }
}
