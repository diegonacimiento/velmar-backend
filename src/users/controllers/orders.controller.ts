import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { OrdersService } from '../services/orders.service';
import { MyParseIntPipe } from 'src/common/my-parse-int/my-parse-int.pipe';
import { CreateOrderDto, UpdateOrderDto } from '../dtos/order.dto';
import { JwtGuard } from 'src/auth/guards/jwt.guard';

@ApiTags('orders')
@UseGuards(JwtGuard)
@Controller('orders')
export class OrdersController {
  constructor(private ordersService: OrdersService) {}

  @Get()
  async getAll() {
    return await this.ordersService.getAll();
  }

  @Get(':id')
  async getOne(@Param('id', MyParseIntPipe) id: number) {
    return await this.ordersService.getOne(id);
  }

  @Post()
  async create(@Body() payload: CreateOrderDto) {
    return {
      message: 'Order created',
      order: await this.ordersService.create(payload),
    };
  }

  @Put(':id')
  async update(
    @Param('id', MyParseIntPipe) id: number,
    @Body() payload: UpdateOrderDto,
  ) {
    return {
      message: 'Order updated',
      order: await this.ordersService.update(id, payload),
    };
  }

  @Delete(':id')
  async delete(@Param('id', MyParseIntPipe) id: number) {
    return {
      message: 'Order deleted',
      order: await this.ordersService.delete(id),
    };
  }

  @Put(':id/user/:userId')
  async changeUser(
    @Param('id', MyParseIntPipe) id: number,
    @Param('userId', MyParseIntPipe) userId: number,
  ) {
    return {
      message: 'User changed in the order',
      order: await this.ordersService.changeUser(id, userId),
    };
  }
}
