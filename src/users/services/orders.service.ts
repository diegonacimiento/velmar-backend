import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Order } from '../entities/order.entity';
import { CreateOrderDto, UpdateOrderDto } from '../dtos/order.dto';
import { addOneEntity, changeEntityRelated } from 'src/utils/shared-functions';
import { User } from '../entities/user.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order) private orderRepository: Repository<Order>,
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async getAll() {
    return await this.orderRepository.find({
      relations: ['user', 'items', 'items.product'],
    });
  }

  async getOne(id: number) {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['user', 'items', 'items.product'],
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return order;
  }

  async create(payload: CreateOrderDto) {
    const newOrder = new Order();

    if (payload.userId) {
      await addOneEntity(this.userRepository, payload.userId, newOrder);
    }

    return await this.orderRepository.save(newOrder);
  }

  async update(id: number, payload: UpdateOrderDto) {
    const order = await this.getOne(id);
    await addOneEntity(this.userRepository, payload.userId, order);
    return await this.orderRepository.save(order);
  }

  async delete(id: number) {
    const order = await this.getOne(id);
    await this.orderRepository.delete(id);
    return order;
  }

  async changeUser(id: number, userId: number) {
    const order = await this.getOne(id);
    await changeEntityRelated(this.userRepository, userId, order);
    return await this.orderRepository.save(order);
  }
}
