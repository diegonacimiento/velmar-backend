import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CartItem } from '../entities/cart-item.entity';
import { Repository } from 'typeorm';
import { CreateCartItemDto } from '../dtos/cart-item.dto';
import { addOneEntity } from 'src/utils/shared-functions';
import { Cart } from '../entities/cart.entity';
import { Product } from 'src/products/entities/product.entity';

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
    return await this.cartItemRepository.find();
  }

  async getOne(id: number) {
    const cartItem = await this.cartItemRepository.findOne({ where: { id } });

    if (!cartItem) {
      throw new NotFoundException('Cart item not found');
    }

    return cartItem;
  }

  async create(payload: CreateCartItemDto) {
    const newCartItem = this.cartItemRepository.create(payload);

    if (payload.cartId && payload.productId) {
      await addOneEntity(this.cartRepository, payload.cartId, newCartItem);
      await addOneEntity(
        this.productRepository,
        payload.productId,
        newCartItem,
      );
    }

    return await this.cartItemRepository.save(newCartItem);
  }

  async delete(id: number) {
    const cartItem = await this.getOne(id);

    await this.cartItemRepository.delete(id);

    return cartItem;
  }

  async deleteByCart(cartId: number) {
    const cartItems = await this.cartItemRepository.find({
      where: { cart: { id: cartId } },
    });

    await this.cartItemRepository.delete({ cart: { id: cartId } });

    return cartItems;
  }
}
