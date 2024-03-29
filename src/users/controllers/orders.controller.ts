import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Request } from 'express';

import { OrdersService } from '../services/orders.service';
import { MyParseIntPipe } from 'src/common/my-parse-int/my-parse-int.pipe';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { RoleGuard } from 'src/auth/guards/role.guard';
import { Role } from 'src/auth/decorators/role.decorator';
import { ROLE } from 'src/auth/models/role.model';
import { CreateOrderDto, UpdateOrderDto } from '../dtos/order.dto';
import { PayloadToken } from 'src/auth/models/token.model';
import { ApiSecretGuard } from '../guards/api-secret.guard';
import { ORDER_STATUS } from '../model/order-status.model';

@ApiTags('orders')
@UseGuards(JwtGuard, RoleGuard)
@Controller('orders')
export class OrdersController {
  constructor(private ordersService: OrdersService) {}

  @Role(ROLE.SUPERADMIN, ROLE.CUSTOMER)
  @Get()
  async getAll(@Req() req: Request) {
    const user = req.user as PayloadToken;
    if (user.role === ROLE.CUSTOMER) {
      return await this.ordersService.getAllByUser(user.sub);
    }
    return await this.ordersService.getAll();
  }

  @Role(ROLE.SUPERADMIN)
  @Get(':id')
  async getOne(@Param('id', MyParseIntPipe) id: number) {
    return await this.ordersService.getOne(id);
  }

  @Role(ROLE.SUPERADMIN, ROLE.CUSTOMER)
  @Post()
  async create(@Body() payload: CreateOrderDto, @Req() req: Request) {
    const user = req.user as PayloadToken;
    return {
      message: 'Order created',
      order: await this.ordersService.create({
        userId: user.role === ROLE.CUSTOMER ? user.sub : payload.userId,
      }),
    };
  }

  @UseGuards(ApiSecretGuard)
  @Role(ROLE.SUPERADMIN, ROLE.CUSTOMER)
  @Put(':id')
  async update(
    @Param('id', MyParseIntPipe) id: number,
    @Body() payload: UpdateOrderDto,
    @Req() req: Request,
  ) {
    const user = req.user as PayloadToken;
    const body =
      user.role === ROLE.CUSTOMER
        ? { status: ORDER_STATUS.SOLD, userId: user.sub }
        : payload;
    return {
      message: 'Order updated',
      order: await this.ordersService.update(id, body),
    };
  }

  @UseGuards(ApiSecretGuard)
  @Role(ROLE.SUPERADMIN, ROLE.CUSTOMER)
  @Delete(':id')
  async delete(
    @Param('id', MyParseIntPipe) id: number,
    @Body('userId') userId: number,
    @Req() req: Request,
  ) {
    const user = req.user as PayloadToken;
    return {
      message: 'Order deleted',
      order: await this.ordersService.delete({
        id,
        userId: user.role === ROLE.CUSTOMER ? user.sub : userId,
      }),
    };
  }
}
