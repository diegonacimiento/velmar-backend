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

import { BrandsService } from '../services/brands.service';
import { MyParseIntPipe } from 'src/common/my-parse-int/my-parse-int.pipe';
import { CreateBrandDto, UpdateBrandDto } from '../dtos/brand.dto';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { Public } from 'src/auth/decorators/public.decorator';
import { RoleGuard } from 'src/auth/guards/role.guard';
import { Role } from 'src/auth/decorators/role.decorator';
import { ROLE } from 'src/auth/models/role.model';

@ApiTags('brands')
@UseGuards(JwtGuard, RoleGuard)
@Controller('brands')
export class BrandsController {
  constructor(private brandsService: BrandsService) {}

  @Public()
  @Get()
  async getAll() {
    return await this.brandsService.getAll();
  }

  @Public()
  @Get(':id')
  async getOne(@Param('id', MyParseIntPipe) id: number) {
    return await this.brandsService.getOne(id);
  }

  @Role(ROLE.ADMIN, ROLE.SUPERADMIN)
  @Post()
  async create(@Body() payload: CreateBrandDto) {
    return {
      message: 'Brand created',
      brand: await this.brandsService.create(payload),
    };
  }

  @Role(ROLE.ADMIN, ROLE.SUPERADMIN)
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

  @Role(ROLE.ADMIN, ROLE.SUPERADMIN)
  @Delete(':id')
  async delete(@Param('id', MyParseIntPipe) id: number) {
    return {
      message: 'Brand deleted',
      brand: await this.brandsService.delete(id),
    };
  }

  @Role(ROLE.ADMIN, ROLE.SUPERADMIN)
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

  @Role(ROLE.ADMIN, ROLE.SUPERADMIN)
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
