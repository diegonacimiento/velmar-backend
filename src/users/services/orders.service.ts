import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Order } from '../entities/order.entity';
import { CreateOrderDto, UpdateOrderDto } from '../dtos/order.dto';
import { addCartInOrder, addOneEntity } from 'src/utils/shared-functions';
import { User } from '../entities/user.entity';
import { Cart } from '../entities/cart.entity';
import { ORDER_STATUS } from '../model/order-status.model';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order) private orderRepository: Repository<Order>,
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Cart) private cartRepository: Repository<Cart>,
  ) {}

  // GET
  async getAll() {
    return await this.orderRepository.find({
      relations: ['user'],
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

  async getAllByUser(userId: number) {
    const orders = await this.orderRepository.find({
      where: { user: { id: userId } },
      relations: ['user', 'items', 'items.product'],
    });
    return orders;
  }

  // POST
  async create(payload: CreateOrderDto) {
    const newOrder = this.orderRepository.create();

    if (payload.userId) {
      await addOneEntity(this.userRepository, payload.userId, newOrder);
      await addCartInOrder(this.cartRepository, payload.userId, newOrder);
    }

    return await this.orderRepository.save(newOrder);
  }

  // UPDATE
  async update(id: number, payload: UpdateOrderDto) {
    const order = await this.getOne(id);
    this.orderRepository.merge(order, payload);
    return await this.orderRepository.save(order);
  }

  async soldStatus(id: number, userId: number) {
    const order = await this.orderRepository.findOne({
      where: { user: { id: userId }, id },
    });
    if (!order) {
      throw new NotFoundException('Order not found');
    }
    if (order.status === ORDER_STATUS.IN_PROGRESS) {
      order.status = ORDER_STATUS.SOLD;
    }
    return await this.orderRepository.save(order);
  }

  // DELETE
  async delete({ id, userId }: { id: number; userId: number }) {
    const order = await this.orderRepository.findOne({
      where: { user: { id: userId }, id },
    });
    if (!order) {
      throw new NotFoundException('Order not found');
    }
    await this.orderRepository.delete(id);
    return order;
  }
}
