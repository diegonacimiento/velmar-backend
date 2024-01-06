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

import { BrandsService } from '../services/brands.service';
import { MyParseIntPipe } from 'src/common/my-parse-int/my-parse-int.pipe';
import { CreateBrandDto, UpdateBrandDto } from '../dtos/brand.dto';

@ApiTags('brands')
@Controller('brands')
export class BrandsController {
  constructor(private brandsService: BrandsService) {}

  @Get()
  async getAll() {
    return await this.brandsService.getAll();
  }

  @Get(':id')
  async getOne(@Param('id', MyParseIntPipe) id: number) {
    return await this.brandsService.getOne(id);
  }

  @Post()
  async create(@Body() payload: CreateBrandDto) {
    return {
      message: 'Brand created',
      brand: await this.brandsService.create(payload),
    };
  }

  @Put(':id')
  async update(
    @Param('id', MyParseIntPipe) id: number,
    @Body() payload: UpdateBrandDto,
  ) {
    return {
      message: 'Brand updated',
      brand: await this.brandsService.update(id, payload),
    };
  }

  @Delete(':id')
  async delete(@Param('id', MyParseIntPipe) id: number) {
    return {
      message: 'Brand deleted',
      brand: await this.brandsService.delete(id),
    };
  }

  @Put(':id/category/:categoryId')
  async addCategory(
    @Param('id', MyParseIntPipe) id: number,
    @Param('categoryId', MyParseIntPipe) categoryId: number,
  ) {
    return {
      message: 'Category added in brand',
      brand: await this.brandsService.addCategory(id, categoryId),
    };
  }

  @Delete(':id/category/:categoryId')
  async removeCategory(
    @Param('id', MyParseIntPipe) id: number,
    @Param('categoryId', MyParseIntPipe) categoryId: number,
  ) {
    return {
      message: 'Category removed from brand',
      brand: await this.brandsService.removeCategory(id, categoryId),
    };
  }
}
