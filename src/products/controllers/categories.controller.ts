import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CategoriesService } from '../services/categories.service';
import { ApiTags } from '@nestjs/swagger';
import { MyParseIntPipe } from 'src/common/my-parse-int/my-parse-int.pipe';
import { CreateCategoryDto, UpdateCategoryDto } from '../dtos/category.dto';

@ApiTags('categories')
@Controller('categories')
export class CategoriesController {
  constructor(private categoriesService: CategoriesService) {}

  @Get()
  async getAll() {
    return await this.categoriesService.getAll();
  }

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
