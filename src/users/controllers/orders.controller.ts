import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { OrdersService } from '../services/orders.service';
import { MyParseIntPipe } from 'src/common/my-parse-int/my-parse-int.pipe';
import { CreateOrderDto, UpdateOrderDto } from '../dtos/order.dto';

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
    return await this.ordersService.create(payload);
  }

  @Put(':id')
  async update(
    @Param('id', MyParseIntPipe) id: number,
    @Body() payload: UpdateOrderDto,
  ) {
    return await this.ordersService.update(id, payload);
  }

  @Delete(':id')
  async delete(@Param('id', MyParseIntPipe) id: number) {
    return await this.ordersService.delete(id);
  }
}
