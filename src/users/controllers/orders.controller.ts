import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Request } from 'express';

import { OrdersService } from '../services/orders.service';
import { MyParseIntPipe } from 'src/common/my-parse-int/my-parse-int.pipe';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { RoleGuard } from 'src/auth/guards/role.guard';
import { Role } from 'src/auth/decorators/role.decorator';
import { ROLE } from 'src/auth/models/role.model';
import { PayloadToken } from 'src/auth/models/token.model';
import { ApiKeyGuard } from '../guards/api-key.guard';

@ApiTags('orders')
@UseGuards(JwtGuard, RoleGuard)
@Controller('orders')
export class OrdersController {
  constructor(private ordersService: OrdersService) {}

  @Role(ROLE.SUPERADMIN)
  @Get()
  async getAll() {
    return await this.ordersService.getAll();
  }

  @Role(ROLE.SUPERADMIN)
  @Get(':id')
  async getOne(@Param('id', MyParseIntPipe) id: number) {
    return await this.ordersService.getOne(id);
  }

  @Role(ROLE.CUSTOMER)
  @Post()
  async create(@Req() req: Request) {
    const user = req.user as PayloadToken;
    return {
      message: 'Order created',
      order: await this.ordersService.create({ userId: user.sub }),
    };
  }

  @Role(ROLE.CUSTOMER, ROLE.SUPERADMIN)
  @UseGuards(ApiKeyGuard)
  @Put(':id/sold-status')
  async update(@Param('id', MyParseIntPipe) id: number, @Req() req: Request) {
    const user = req.user as PayloadToken;
    return {
      message: 'Order updated',
      order: await this.ordersService.update(id, user.sub),
    };
  }

  @Role(ROLE.SUPERADMIN)
  @Delete(':id')
  async delete(@Param('id', MyParseIntPipe) id: number) {
    return {
      message: 'Order deleted',
      order: await this.ordersService.delete(id),
    };
  }

  @Role(ROLE.SUPERADMIN)
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
