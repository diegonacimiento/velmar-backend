import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CartItem } from '../entities/cart-item.entity';
import { CreateCartItemDto } from '../dtos/cart-item.dto';
import { addOneEntity } from 'src/utils/shared-functions';
import { Cart } from '../entities/cart.entity';
import { Product } from 'src/products/entities/product.entity';
import { relationsCartItem, selectCartItem } from 'src/utils/select-relations';

@Injectable()
export class CartItemsService {
  constructor(
    @InjectRepository(CartItem)
    private cartItemRepository: Repository<CartItem>,
    @InjectRepository(Cart)
    private cartRepository: Repository<Cart>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  async getAll() {
    return await this.cartItemRepository.find({
      relations: { cart: { user: true } },
      select: { cart: { id: true, user: { id: true, username: true } } },
    });
  }

  async getOne(id: number) {
    const cartItem = await this.cartItemRepository.findOne({
      where: { id },
      relations: relationsCartItem,
      select: selectCartItem,
    });

    if (!cartItem) {
      throw new NotFoundException('Cart item not found');
    }

    return cartItem;
  }

  async getOneWithUser(id: number, userId: number) {
    const cartItem = await this.getOne(id);

    if (!cartItem || cartItem.cart.user.id !== userId) {
      throw new NotFoundException('Cart item not found');
    }
    return cartItem;
  }

  async create(payload: CreateCartItemDto) {
    if (!payload.userId) {
      throw new BadRequestException(
        'You must send an id that belongs to a user',
      );
    }
    const cartItem = await this.cartItemRepository.findOne({
      where: {
        cart: { user: { id: payload.userId } },
        product: { id: payload.productId },
      },
      relations: relationsCartItem,
      select: selectCartItem,
    });

    if (cartItem) {
      cartItem.quantity += payload.quantity;
      return await this.cartItemRepository.save(cartItem);
    }

    const newCartItem = this.cartItemRepository.create(payload);

    const cart = await this.cartRepository.findOne({
      where: { user: { id: payload.userId } },
      relations: { user: true },
      select: { id: true, user: { id: true, username: true } },
    });

    if (!cart) {
      throw new NotFoundException('Cart not found');
    }

    if (payload.productId) {
      newCartItem.cart = cart;
      await addOneEntity(
        this.productRepository,
        payload.productId,
        newCartItem,
      );
    }

    return await this.cartItemRepository.save(newCartItem);
  }

  async delete({ id, userId }: { id: number; userId: number }) {
    const cartItem = await this.getOneWithUser(id, userId);

    await this.cartItemRepository.delete(id);

    return cartItem;
  }

  async deleteAll(userId: number) {
    const cartItems = await this.cartItemRepository.find({
      where: { cart: { user: { id: userId } } },
      relations: relationsCartItem,
      select: selectCartItem,
    });

    if (!cartItems) {
      throw new NotFoundException('Cart items not found');
    }

    await this.cartItemRepository.delete({ cart: { user: { id: userId } } });

    return cartItems;
  }

  async addUnit(id: number, userId: number) {
    const cartItem = await this.getOneWithUser(id, userId);

    cartItem.quantity++;

    return await this.cartItemRepository.save(cartItem);
  }

  async removeUnit(id: number, userId: number) {
    const cartItem = await this.getOneWithUser(id, userId);

    cartItem.quantity--;

    return await this.cartItemRepository.save(cartItem);
  }
}
