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

import { CategoriesService } from '../services/categories.service';
import { MyParseIntPipe } from 'src/common/my-parse-int/my-parse-int.pipe';
import { CreateCategoryDto, UpdateCategoryDto } from '../dtos/category.dto';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { Public } from 'src/auth/decorators/public.decorator';
import { RoleGuard } from 'src/auth/guards/role.guard';
import { Role } from 'src/auth/decorators/role.decorator';
import { ROLE } from 'src/auth/models/role.model';
import { PayloadToken } from 'src/auth/models/token.model';

@ApiTags('categories')
@UseGuards(JwtGuard, RoleGuard)
@Controller('categories')
export class CategoriesController {
  constructor(private categoriesService: CategoriesService) {}

  @Public()
  @Get()
  async getAll() {
    return await this.categoriesService.getAll();
  }

  @Public()
  @Get(':id')
  async getOne(@Param('id', MyParseIntPipe) id: number) {
    return await this.categoriesService.getOne(id);
  }

  @Role(ROLE.SALESPERSON, ROLE.SUPERADMIN)
  @Post()
  async create(@Req() req: Request, @Body() payload: CreateCategoryDto) {
    const user = req.user as PayloadToken;

    return {
      message: 'Category created',
      category: await this.categoriesService.create(payload, user.role),
    };
  }

  @Role(ROLE.SALESPERSON, ROLE.SUPERADMIN)
  @Put(':id')
  async update(
    @Req() req: Request,
    @Param('id', MyParseIntPipe) id: number,
    @Body() payload: UpdateCategoryDto,
  ) {
    const user = req.user as PayloadToken;

    return {
      message: 'Category updated',
      category: await this.categoriesService.update(id, payload, user.role),
    };
  }

  @Role(ROLE.SALESPERSON, ROLE.SUPERADMIN)
  @Delete(':id')
  async delete(@Req() req: Request, @Param('id', MyParseIntPipe) id: number) {
    const user = req.user as PayloadToken;

    return {
      message: 'Category deleted',
      category: await this.categoriesService.delete(id, user.role),
    };
  }

  // @Role(ROLE.SALESPERSON, ROLE.SUPERADMIN)
  // @Delete(':id/relations')
  // async removeAllRelations(@Param('id', MyParseIntPipe) id: number) {
  //   await this.categoriesService.removeAllRelations(id);
  //   return {
  //     message: 'Relations deleted',
  //   };
  // }
}
