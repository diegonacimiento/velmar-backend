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
    return await this.cartItemRepository.find({ relations: ['cart'] });
  }

  async getOne(id: number) {
    const cartItem = await this.cartItemRepository.findOne({
      where: { id },
      relations: ['cart'],
    });

    if (!cartItem) {
      throw new NotFoundException('Cart item not found');
    }

    return cartItem;
  }

  async getOneWithUser(id: number, userId: number) {
    const cartItem = await this.cartItemRepository.findOne({
      where: { cart: { user: { id: userId } }, id },
    });

    if (!cartItem) {
      throw new NotFoundException('Cart item not found');
    }
    return cartItem;
  }

  async create(payload: CreateCartItemDto) {
    const cartItem = await this.cartItemRepository.findOne({
      where: {
        cart: { user: { id: payload.userId } },
        product: { id: payload.productId },
      },
    });

    if (cartItem) {
      cartItem.quantity += payload.quantity;
      return await this.cartItemRepository.save(cartItem);
    }

    const newCartItem = this.cartItemRepository.create(payload);

    const cart = await this.cartRepository.findOne({
      where: { user: { id: payload.userId } },
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
