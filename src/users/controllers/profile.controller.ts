import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { RoleGuard } from 'src/auth/guards/role.guard';
import { OrdersService } from '../services/orders.service';
import { Role } from 'src/auth/decorators/role.decorator';
import { ROLE } from 'src/auth/models/role.model';
import { Request } from 'express';
import { PayloadToken } from 'src/auth/models/token.model';
import { UsersService } from '../services/users.service';
import { UpdateUserDto } from '../dtos/user.dto';
import { CartsService } from '../services/carts.service';

@UseGuards(JwtGuard, RoleGuard)
@ApiTags('profile')
@Controller('profile')
export class ProfileController {
  constructor(
    private ordersService: OrdersService,
    private usersService: UsersService,
    private cartsService: CartsService,
  ) {}

  // ORDERS
  @Role(ROLE.CUSTOMER)
  @Get('orders')
  async getAllOrders(@Req() req: Request) {
    const user = req.user as PayloadToken;

    return await this.ordersService.getAllByUser(user.sub);
  }

  // CART
  @Role(ROLE.CUSTOMER)
  @Get('cart')
  async getCart(@Req() req: Request) {
    const user = req.user as PayloadToken;
    return await this.cartsService.getOneByUser(user.sub);
  }

  @Role(ROLE.CUSTOMER)
  @Post()
  async createCart(@Req() req: Request) {
    const user = req.user as PayloadToken;
    return {
      message: 'Cart created',
      cart: await this.cartsService.create({ userId: user.sub }),
    };
  }

  // USERS
  @Put('update')
  async updateUser(@Req() req: Request, @Body() payload: UpdateUserDto) {
    const user = req.user as PayloadToken;

    return await this.usersService.update(user.sub, payload);
  }
}
