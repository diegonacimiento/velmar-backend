import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ItemOrder } from '../entities/item-order.entity';
import { CreateItemOrderDto, UpdateItemOrderDto } from '../dtos/item-order.dto';
import { addOneEntity } from 'src/utils/shared-functions';
import { Order } from '../entities/order.entity';
import { Product } from 'src/products/entities/product.entity';

@Injectable()
export class ItemsOrderService {
  constructor(
    @InjectRepository(ItemOrder)
    private itemOrderRepository: Repository<ItemOrder>,
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  async getAll() {
    return await this.itemOrderRepository.find({
      relations: ['order', 'order.user', 'product'],
    });
  }

  async getOne(id: number) {
    const item = await this.itemOrderRepository.findOne({
      where: { id },
      relations: ['order', 'order.user', 'product'],
    });

    if (!item) {
      throw new NotFoundException('Item not found');
    }

    return item;
  }

  async create(payload: CreateItemOrderDto) {
    const newItem = this.itemOrderRepository.create(payload);

    if (payload.orderId && payload.productId) {
      await addOneEntity(this.orderRepository, payload.orderId, newItem);
      await addOneEntity(this.productRepository, payload.productId, newItem);
    }
    return await this.itemOrderRepository.save(newItem);
  }

  async update(id: number, payload: UpdateItemOrderDto) {
    const item = await this.getOne(id);

    if (payload.orderId) {
      await addOneEntity(this.orderRepository, payload.orderId, item);
    }

    if (payload.productId) {
      await addOneEntity(this.productRepository, payload.productId, item);
    }

    return await this.itemOrderRepository.save(item);
  }

  async delete(id: number) {
    const item = await this.getOne(id);

    await this.itemOrderRepository.delete(id);

    return item;
  }
}
