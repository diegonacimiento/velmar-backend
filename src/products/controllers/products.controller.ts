import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
  Query,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { ApiTags } from '@nestjs/swagger';

import { ProductsService } from '../services/products.service';
import { MyParseIntPipe } from 'src/common/my-parse-int/my-parse-int.pipe';
import {
  CreateProductDto,
  FilterProductDto,
  UpdateProductDto,
} from '../dtos/product.dto';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { Public } from 'src/auth/decorators/public.decorator';
import { RoleGuard } from 'src/auth/guards/role.guard';
import { Role } from 'src/auth/decorators/role.decorator';
import { ROLE } from 'src/auth/models/role.model';
import { PayloadToken } from 'src/auth/models/token.model';

@ApiTags('products')
@UseGuards(JwtGuard, RoleGuard)
@Controller('products')
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  @Public()
  @Get()
  async getAll(@Query() params: FilterProductDto) {
    return await this.productsService.getAll(params);
  }

  @Public()
  @Get(':id')
  async getOne(@Param('id', MyParseIntPipe) id: number) {
    return await this.productsService.getOne(id);
  }

  @Role(ROLE.SALESPERSON, ROLE.SUPERADMIN)
  @Post()
  async create(@Req() req: Request, @Body() payload: CreateProductDto) {
    const user = req.user as PayloadToken;

    return {
      message: 'Product created',
      product: await this.productsService.create(payload, user.role),
    };
  }

  @Role(ROLE.SALESPERSON, ROLE.SUPERADMIN)
  @Put(':id')
  async update(
    @Req() req: Request,
    @Param('id', MyParseIntPipe) id: number,
    @Body() payload: UpdateProductDto,
  ) {
    const user = req.user as PayloadToken;

    return {
      message: 'Product updated',
      product: await this.productsService.update(id, payload, user.role),
    };
  }

  @Role(ROLE.SALESPERSON, ROLE.SUPERADMIN)
  @Delete(':id')
  async delete(@Req() req: Request, @Param('id', MyParseIntPipe) id: number) {
    const user = req.user as PayloadToken;

    return {
      message: 'Product deleted',
      product: await this.productsService.delete(id, user.role),
    };
  }

  // @Role(ROLE.SALESPERSON, ROLE.SUPERADMIN)
  // @Put(':id/category/:categoryId')
  // async addCategory(
  //   @Param('id', MyParseIntPipe) id: number,
  //   @Param('categoryId', MyParseIntPipe) categoryId: number,
  // ) {
  //   return {
  //     message: 'Category added in product',
  //     product: await this.productsService.addCategory(id, categoryId),
  //   };
  // }

  // @Role(ROLE.SALESPERSON, ROLE.SUPERADMIN)
  // @Delete(':id/category/:categoryId')
  // async removeCategory(
  //   @Param('id', MyParseIntPipe) id: number,
  //   @Param('categoryId', MyParseIntPipe) categoryId: number,
  // ) {
  //   return {
  //     message: 'Category removed from product',
  //     product: await this.productsService.removeCategory(id, categoryId),
  //   };
  // }

  // @Role(ROLE.SALESPERSON, ROLE.SUPERADMIN)
  // @Put(':id/brand/:brandId')
  // async changeBrand(
  //   @Param('id', MyParseIntPipe) id: number,
  //   @Param('brandId', MyParseIntPipe) brandId: number,
  // ) {
  //   return {
  //     message: 'Brand changed in product',
  //     product: await this.productsService.changeBrand(id, brandId),
  //   };
  // }
}
