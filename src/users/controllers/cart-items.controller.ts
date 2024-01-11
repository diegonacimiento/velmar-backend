import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { CartItemsService } from '../services/cart-items.service';
import { MyParseIntPipe } from 'src/common/my-parse-int/my-parse-int.pipe';
import { CreateCartItemDto } from '../dtos/cart-item.dto';

@ApiTags('cart-items')
@Controller('cart-items')
export class CartItemsController {
  constructor(private cartItemsService: CartItemsService) {}

  @Get()
  async getAll() {
    return await this.cartItemsService.getAll();
  }

  @Get(':id')
  async getOne(@Param('id', MyParseIntPipe) id: number) {
    return await this.cartItemsService.getOne(id);
  }

  @Post()
  async create(@Body() payload: CreateCartItemDto) {
    return {
      message: 'Cart item created',
      cartItem: await this.cartItemsService.create(payload),
    };
  }

  @Delete(':id')
  async delete(@Param('id', MyParseIntPipe) id: number) {
    return {
      message: 'Cart item deleted',
      cartItem: await this.cartItemsService.delete(id),
    };
  }

  @Delete()
  async deleteByCart(@Param('cartId', MyParseIntPipe) cartId: number) {
    return {
      message: 'Items deleted of cart',
      cartItem: await this.cartItemsService.deleteByCart(cartId),
    };
  }
}
