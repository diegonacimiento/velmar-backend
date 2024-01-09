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

import { ItemsOrderService } from '../services/items-order.service';
import { MyParseIntPipe } from 'src/common/my-parse-int/my-parse-int.pipe';
import { CreateItemOrderDto, UpdateItemOrderDto } from '../dtos/item-order.dto';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { RoleGuard } from 'src/auth/guards/role.guard';
import { Role } from 'src/auth/decorators/role.decorator';
import { ROLE } from 'src/auth/models/role.model';

@ApiTags('items-order')
@UseGuards(JwtGuard, RoleGuard)
@Controller('items-order')
export class ItemsOrderController {
  constructor(private itemsOrderService: ItemsOrderService) {}

  @Role(ROLE.CUSTOMER)
  @Get()
  async getAll() {
    return await this.itemsOrderService.getAll();
  }

  @Role(ROLE.CUSTOMER)
  @Get(':id')
  async getOne(@Param('id', MyParseIntPipe) id: number) {
    return await this.itemsOrderService.getOne(id);
  }

  @Role(ROLE.CUSTOMER)
  @Post()
  async create(@Body() payload: CreateItemOrderDto) {
    return {
      message: 'Item created',
      item: await this.itemsOrderService.create(payload),
    };
  }

  @Role(ROLE.CUSTOMER)
  @Put(':id')
  async update(
    @Param('id', MyParseIntPipe) id: number,
    @Body() payload: UpdateItemOrderDto,
  ) {
    return {
      message: 'Item updated',
      item: await this.itemsOrderService.update(id, payload),
    };
  }

  @Role(ROLE.CUSTOMER)
  @Delete(':id')
  async delete(@Param('id', MyParseIntPipe) id: number) {
    return {
      message: 'Item deleted',
      item: await this.itemsOrderService.delete(id),
    };
  }
}
