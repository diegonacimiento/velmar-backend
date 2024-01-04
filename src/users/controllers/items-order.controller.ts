import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ItemsOrderService } from '../services/items-order.service';
import { MyParseIntPipe } from 'src/common/my-parse-int/my-parse-int.pipe';
import { CreateItemOrderDto, UpdateItemOrderDto } from '../dtos/item-order.dto';

@Controller('items-order')
export class ItemsOrderController {
  constructor(private itemsOrderService: ItemsOrderService) {}

  @Get()
  async getAll() {
    return await this.itemsOrderService.getAll();
  }

  @Get(':id')
  async getOne(@Param('id', MyParseIntPipe) id: number) {
    return await this.itemsOrderService.getOne(id);
  }

  @Post()
  async create(@Body() payload: CreateItemOrderDto) {
    return await this.itemsOrderService.create(payload);
  }

  @Put(':id')
  async update(
    @Param('id', MyParseIntPipe) id: number,
    @Body() payload: UpdateItemOrderDto,
  ) {
    return await this.itemsOrderService.update(id, payload);
  }

  @Delete(':id')
  async delete(@Param('id', MyParseIntPipe) id: number) {
    return await this.delete(id);
  }
}
