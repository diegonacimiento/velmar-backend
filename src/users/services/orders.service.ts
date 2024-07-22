import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Order } from '../entities/order.entity';
import {
  CreateOrderDto,
  FilterOrderDto,
  UpdateOrderDto,
} from '../dtos/order.dto';
import { addOneEntity } from 'src/utils/shared-functions';
import { User } from '../entities/user.entity';
import { Cart } from '../entities/cart.entity';
import { relationsOrder, selectOrder } from 'src/utils/select-relations';
import { ORDER_STATUS } from '../model/order-status.model';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order) private orderRepository: Repository<Order>,
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Cart) private cartRepository: Repository<Cart>,
  ) {}

  async getAll() {
    return await this.orderRepository.find({
      where: { status: ORDER_STATUS.SOLD },
      relations: relationsOrder,
      select: selectOrder,
    });
  }

  async getOne(id: number) {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: relationsOrder,
      select: selectOrder,
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return order;
  }

  async getOneByUser(id: number, userId: number) {
    const order = await this.orderRepository.findOne({
      where: { id, user: { id: userId } },
      relations: relationsOrder,
      select: selectOrder,
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return order;
  }

  async getAllByUser(userId: number, params: FilterOrderDto) {
    const { offset = 0, limit = 10 } = params;

    const orders = await this.orderRepository.find({
      where: { user: { id: userId }, status: ORDER_STATUS.SOLD },
      relations: relationsOrder,
      select: selectOrder,
      order: { createdAt: 'DESC' },
      skip: offset,
      take: limit,
    });
    return orders;
  }

  async create(payload: CreateOrderDto) {
    if (!payload.userId) {
      throw new BadRequestException(
        'You must send an id that belongs to a user',
      );
    }

    const newOrder = this.orderRepository.create();

    if (payload.userId) {
      await addOneEntity(this.userRepository, payload.userId, newOrder);
      // await addCartInOrder(this.cartRepository, payload.userId, newOrder);
    }

    newOrder.products = payload.cart;
    newOrder.status = ORDER_STATUS.SOLD;

    return await this.orderRepository.save(newOrder);
  }

  async update(id: number, payload: UpdateOrderDto) {
    const order = await this.getOne(id);
    if (!order || order?.user?.id !== payload.userId) {
      throw new NotFoundException('Order not found');
    }
    this.orderRepository.merge(order, payload);
    return await this.orderRepository.save(order);
  }

  async delete({ id, userId }: { id: number; userId: number }) {
    const order = await this.getOne(id);
    if (!order || order.user.id !== userId) {
      throw new NotFoundException('Order not found');
    }
    await this.orderRepository.delete(id);
    return order;
  }
}
