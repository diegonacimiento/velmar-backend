import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Category } from '../entities/category.entity';
import { CreateCategoryDto, UpdateCategoryDto } from '../dtos/category.dto';
import { addManyEntities, removeCategory } from 'src/utils/shared-functions';
import { Brand } from '../entities/brand.entity';
import { Product } from '../entities/product.entity';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    @InjectRepository(Brand)
    private brandRepository: Repository<Brand>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  async getAll() {
    return await this.categoryRepository.find();
  }

  async getOne(id: number, relComplete?: boolean) {
    const category = await this.categoryRepository.findOne({
      where: { id },
      relations: {
        products: relComplete ? { categories: true } : true,
        brands: relComplete ? { categories: true } : true,
      },
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

    for (const brand of category.brands) {
      await this.brandRepository
        .createQueryBuilder()
        .relation(Brand, 'categories')
        .of(brand)
        .remove(category);
    }

    for (const product of category.products) {
      await this.productRepository
        .createQueryBuilder()
        .relation(Product, 'categories')
        .of(product)
        .remove(category);
    }
    await this.categoryRepository.delete(id);
    return category;
  }

  async removeAllRelations(id: number) {
    const category = await this.getOne(id, true);
    const products = category.products.map((product) => product);
    const brands = category.brands.map((brand) => brand);
    if (products.length === 0 && brands.length === 0) {
      throw new NotFoundException('This category has no relations');
    }
    for (const product of products) {
      removeCategory(product, id);
      await this.productRepository.save(product);
    }
    for (const brand of brands) {
      removeCategory(brand, id);
      await this.brandRepository.save(brand);
    }
  }
}
