import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { CartsService } from '../services/carts.service';
import { MyParseIntPipe } from 'src/common/my-parse-int/my-parse-int.pipe';
import { CreateCartDto } from '../dtos/cart.dto';

@ApiTags('carts')
@Controller('carts')
export class CartsController {
  constructor(private cartsService: CartsService) {}

  @Get()
  async getAll() {
    return await this.cartsService.getAll();
  }

  @Get(':id')
  async getOne(@Param('id', MyParseIntPipe) id: number) {
    return await this.cartsService.getOne(id);
  }

  @Post()
  async create(@Body() payload: CreateCartDto) {
    return {
      message: 'Cart created',
      cart: await this.cartsService.create(payload),
    };
  }

  @Delete(':id')
  async delete(@Param('id', MyParseIntPipe) id: number) {
    return {
      message: 'Cart deleted',
      cart: await this.cartsService.delete(id),
    };
  }
}
