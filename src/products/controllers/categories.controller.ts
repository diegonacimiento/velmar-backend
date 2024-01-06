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

import { CategoriesService } from '../services/categories.service';
import { MyParseIntPipe } from 'src/common/my-parse-int/my-parse-int.pipe';
import { CreateCategoryDto, UpdateCategoryDto } from '../dtos/category.dto';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { Public } from 'src/auth/decorators/public.decorator';

@ApiTags('categories')
@UseGuards(JwtGuard)
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

  @Post()
  async create(@Body() payload: CreateCategoryDto) {
    return {
      message: 'Category created',
      category: await this.categoriesService.create(payload),
    };
  }

  @Put(':id')
  async update(
    @Param('id', MyParseIntPipe) id: number,
    @Body() payload: UpdateCategoryDto,
  ) {
    return {
      message: 'Category updated',
      category: await this.categoriesService.update(id, payload),
    };
  }

  @Delete(':id')
  async delete(@Param('id', MyParseIntPipe) id: number) {
    return {
      message: 'Category deleted',
      category: await this.categoriesService.delete(id),
    };
  }
}
