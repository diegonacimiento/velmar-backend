import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
  Req,
  Put,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Request } from 'express';

import { CartItemsService } from '../services/cart-items.service';
import { MyParseIntPipe } from '../../common/my-parse-int/my-parse-int.pipe';
import { CreateCartItemDto } from '../dtos/cart-item.dto';
import { JwtGuard } from '../../auth/guards/jwt.guard';
import { RoleGuard } from '../../auth/guards/role.guard';
import { Role } from '../../auth/decorators/role.decorator';
import { ROLE } from '../../auth/models/role.model';
import { PayloadToken } from '../../auth/models/token.model';

@ApiTags('cart-items')
@UseGuards(JwtGuard, RoleGuard)
@Controller('cart-items')
export class CartItemsController {
  constructor(private cartItemsService: CartItemsService) {}

  @Role(ROLE.SUPERADMIN)
  @Get()
  async getAll() {
    return await this.cartItemsService.getAll();
  }

  @Role(ROLE.SUPERADMIN)
  @Get(':id')
  async getOne(@Param('id', MyParseIntPipe) id: number) {
    return await this.cartItemsService.getOne(id);
  }

  @Role(ROLE.SUPERADMIN, ROLE.CUSTOMER)
  @Post()
  async create(@Body() payload: CreateCartItemDto, @Req() req: Request) {
    const user = req.user as PayloadToken;
    return {
      message: 'Cart item created',
      cartItem: await this.cartItemsService.create({
        userId: user.role === ROLE.CUSTOMER ? user.sub : payload.userId,
        ...payload,
      }),
    };
  }

  @Role(ROLE.CUSTOMER)
  @Put(':id/add-unit')
  async addUnit(@Param('id', MyParseIntPipe) id: number, @Req() req: Request) {
    const user = req.user as PayloadToken;
    return {
      message: 'Cart item updated',
      item: await this.cartItemsService.addUnit(id, user.sub),
    };
  }

  @Role(ROLE.CUSTOMER)
  @Put(':id/remove-unit')
  async removeUnit(
    @Param('id', MyParseIntPipe) id: number,
    @Req() req: Request,
  ) {
    const user = req.user as PayloadToken;
    return {
      message: 'Cart item updated',
      item: await this.cartItemsService.removeUnit(id, user.sub),
    };
  }

  @Role(ROLE.SUPERADMIN, ROLE.CUSTOMER)
  @Delete(':id')
  async delete(
    @Param('id', MyParseIntPipe) id: number,
    @Body('userId') userId: number,
    @Req() req: Request,
  ) {
    const user = req.user as PayloadToken;
    const params = {
      id,
      userId: user.role === ROLE.CUSTOMER ? user.sub : userId,
    };
    return {
      message: 'Cart item deleted',
      cartItem: await this.cartItemsService.delete(params),
    };
  }

  @Role(ROLE.SUPERADMIN, ROLE.CUSTOMER)
  @Delete('delete-all')
  async deleteAll(@Body('userId') userId: number, @Req() req: Request) {
    const user = req.user as PayloadToken;
    const id = user.role === ROLE.CUSTOMER ? user.sub : userId;
    return {
      message: 'Items deleted of cart',
      cartItem: await this.cartItemsService.deleteAll(id),
    };
  }
}
