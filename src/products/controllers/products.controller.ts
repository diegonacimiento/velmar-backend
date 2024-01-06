import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { ProductsService } from '../services/products.service';
import { MyParseIntPipe } from 'src/common/my-parse-int/my-parse-int.pipe';
import { CreateProductDto, UpdateProductDto } from '../dtos/product.dto';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  @Get()
  async getAll() {
    return await this.productsService.getAll();
  }

  @Get(':id')
  async getOne(@Param('id', MyParseIntPipe) id: number) {
    return await this.productsService.getOne(id);
  }

  @Post()
  async create(@Body() payload: CreateProductDto) {
    return {
      message: 'Product created',
      product: await this.productsService.create(payload),
    };
  }

  @Put(':id')
  async update(
    @Param('id', MyParseIntPipe) id: number,
    @Body() payload: UpdateProductDto,
  ) {
    return {
      message: 'Product updated',
      product: await this.productsService.update(id, payload),
    };
  }

  @Delete(':id')
  async delete(@Param('id', MyParseIntPipe) id: number) {
    return {
      message: 'Product deleted',
      product: await this.productsService.delete(id),
    };
  }

  @Put(':id/category/:categoryId')
  async addCategory(
    @Param('id', MyParseIntPipe) id: number,
    @Param('categoryId', MyParseIntPipe) categoryId: number,
  ) {
    return {
      message: 'Category added in product',
      product: await this.productsService.addCategory(id, categoryId),
    };
  }

  @Delete(':id/category/:categoryId')
  async removeCategory(
    @Param('id', MyParseIntPipe) id: number,
    @Param('categoryId', MyParseIntPipe) categoryId: number,
  ) {
    return {
      message: 'Category removed from product',
      product: await this.productsService.removeCategory(id, categoryId),
    };
  }

  @Put(':id/brand/:brandId')
  async changeBrand(
    @Param('id', MyParseIntPipe) id: number,
    @Param('brandId', MyParseIntPipe) brandId: number,
  ) {
    return {
      message: 'Brand changed in product',
      product: await this.productsService.changeBrand(id, brandId),
    };
  }
}
