import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Request } from 'express';

import { CartsService } from '../services/carts.service';
import { MyParseIntPipe } from 'src/common/my-parse-int/my-parse-int.pipe';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { RoleGuard } from 'src/auth/guards/role.guard';
import { Role } from 'src/auth/decorators/role.decorator';
import { ROLE } from 'src/auth/models/role.model';
import { CreateCartDto } from '../dtos/cart.dto';
import { PayloadToken } from 'src/auth/models/token.model';

@ApiTags('carts')
@UseGuards(JwtGuard, RoleGuard)
@Controller('carts')
export class CartsController {
  constructor(private cartsService: CartsService) {}

  @Role(ROLE.SUPERADMIN, ROLE.CUSTOMER)
  @Get()
  async getAll(@Req() req: Request) {
    const user = req.user as PayloadToken;

    if (user.role === ROLE.CUSTOMER) {
      return await this.cartsService.getOneByUser(user.sub);
    }

    return await this.cartsService.getAll();
  }

  @Role(ROLE.SUPERADMIN)
  @Get(':id')
  async getOne(@Param('id', MyParseIntPipe) id: number) {
    return await this.cartsService.getOne(id);
  }

  @Role(ROLE.SUPERADMIN, ROLE.CUSTOMER)
  @Post()
  async create(@Body() payload: CreateCartDto, @Req() req: Request) {
    const user = req.user as PayloadToken;
    return {
      message: 'Cart created',
      cart: await this.cartsService.create({
        userId: user.role === ROLE.CUSTOMER ? user.sub : payload.userId,
      }),
    };
  }

  @Role(ROLE.SUPERADMIN)
  @Delete(':id')
  async delete(@Param('id', MyParseIntPipe) id: number) {
    return {
      message: 'Cart deleted',
      cart: await this.cartsService.delete(id),
    };
  }
}
