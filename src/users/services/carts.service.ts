import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cart } from '../entities/cart.entity';
import { Repository } from 'typeorm';
import { CreateCartDto } from '../dtos/cart.dto';
import { addOneEntity } from 'src/utils/shared-functions';
import { User } from '../entities/user.entity';

@Injectable()
export class CartsService {
  constructor(
    @InjectRepository(Cart) private cartRepository: Repository<Cart>,
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async getAll() {
    return await this.cartRepository.find({
      relations: ['user', 'items', 'items.product'],
    });
  }

  async getOne(id: number) {
    const cart = await this.cartRepository.findOne({ where: { id } });

    if (!cart) {
      throw new NotFoundException('Cart not found');
    }

    return cart;
  }

  async create(payload: CreateCartDto) {
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
