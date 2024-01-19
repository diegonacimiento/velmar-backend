import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Category } from '../entities/category.entity';
import { CreateCategoryDto, UpdateCategoryDto } from '../dtos/category.dto';
import { addManyEntities } from 'src/utils/shared-functions';
import { Brand } from '../entities/brand.entity';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    @InjectRepository(Brand)
    private brandRepository: Repository<Brand>,
  ) {}

  async getAll() {
    return await this.categoryRepository.find();
  }

  async getOne(id: number) {
    const category = await this.categoryRepository.findOne({
      where: { id },
      relations: { products: true, brands: true },
    });
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    return category;
  }

  async create(payload: CreateCategoryDto) {
    const newCategory = this.categoryRepository.create(payload);
    if (payload.brandsIds) {
      await addManyEntities(
        this.brandRepository,
        payload.brandsIds,
        newCategory,
      );
    }
    return await this.categoryRepository.save(newCategory);
  }

  async update(id: number, payload: UpdateCategoryDto) {
    const category = await this.getOne(id);
    this.categoryRepository.merge(category, payload);
    return await this.categoryRepository.save(category);
  }

  async delete(id: number) {
    const category = await this.getOne(id);
    await this.categoryRepository.delete(id);
    return category;
  }
}
