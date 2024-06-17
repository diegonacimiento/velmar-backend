import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { ApiTags } from '@nestjs/swagger';

import { BrandsService } from '../services/brands.service';
import { MyParseIntPipe } from 'src/common/my-parse-int/my-parse-int.pipe';
import { CreateBrandDto, UpdateBrandDto } from '../dtos/brand.dto';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { Public } from 'src/auth/decorators/public.decorator';
import { RoleGuard } from 'src/auth/guards/role.guard';
import { Role } from 'src/auth/decorators/role.decorator';
import { ROLE } from 'src/auth/models/role.model';
import { PayloadToken } from 'src/auth/models/token.model';

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

  @Role(ROLE.SALESPERSON, ROLE.SUPERADMIN)
  @Post()
  async create(@Req() req: Request, @Body() payload: CreateBrandDto) {
    const user = req.user as PayloadToken;

    return {
      message: 'Brand created',
      brand: await this.brandsService.create(payload, user.role),
    };
  }

  @Role(ROLE.SALESPERSON, ROLE.SUPERADMIN)
  @Put(':id')
  async update(
    @Req() req: Request,
    @Param('id', MyParseIntPipe) id: number,
    @Body() payload: UpdateBrandDto,
  ) {
    const user = req.user as PayloadToken;

    return {
      message: 'Brand updated',
      brand: await this.brandsService.update(id, payload, user.role),
    };
  }

  @Role(ROLE.SALESPERSON, ROLE.SUPERADMIN)
  @Delete(':id')
  async delete(@Req() req: Request, @Param('id', MyParseIntPipe) id: number) {
    const user = req.user as PayloadToken;

    return {
      message: 'Brand deleted',
      brand: await this.brandsService.delete(id, user.role),
    };
  }

  // @Role(ROLE.SALESPERSON, ROLE.SUPERADMIN)
  // @Put(':id/category/:categoryId')
  // async addCategory(
  //   @Param('id', MyParseIntPipe) id: number,
  //   @Param('categoryId', MyParseIntPipe) categoryId: number,
  // ) {
  //   return {
  //     message: 'Category added in brand',
  //     brand: await this.brandsService.addCategory(id, categoryId),
  //   };
  // }

  // @Role(ROLE.SALESPERSON, ROLE.SUPERADMIN)
  // @Delete(':id/category/:categoryId')
  // async removeCategory(
  //   @Param('id', MyParseIntPipe) id: number,
  //   @Param('categoryId', MyParseIntPipe) categoryId: number,
  // ) {
  //   return {
  //     message: 'Category removed from brand',
  //     brand: await this.brandsService.removeCategory(id, categoryId),
  //   };
  // }
}
