import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Product } from '../entities/product.entity';
import { CreateProductDto, UpdateProductDto } from '../dtos/product.dto';
import { Brand } from '../entities/brand.entity';
import { Category } from '../entities/category.entity';
import {
  addCategory,
  addManyEntities,
  addOneEntity,
  changeEntityRelated,
  removeCategory,
} from 'src/utils/shared-functions';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product) private productRepository: Repository<Product>,
    @InjectRepository(Brand) private brandRepository: Repository<Brand>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  async getAll() {
    return await this.productRepository.find();
  }

  async getOne(id: number) {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: ['brand', 'categories'],
    });
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return product;
  }

  async create(payload: CreateProductDto) {
    const newProduct = this.productRepository.create(payload);
    if (payload.brandId) {
      await addOneEntity(this.brandRepository, payload.brandId, newProduct);
    }
    if (payload.categoriesIds) {
      await addManyEntities(
        this.categoryRepository,
        payload.categoriesIds,
        newProduct,
      );
    }
    return await this.productRepository.save(newProduct);
  }

  async update(id: number, payload: UpdateProductDto) {
    const product = await this.getOne(id);
    this.productRepository.merge(product, payload);
    return await this.productRepository.save(product);
  }

  async delete(id: number) {
    const product = await this.getOne(id);
    await this.productRepository.delete(id);
    return product;
  }

  async addCategory(id: number, categoryId: number) {
    const product = await this.getOne(id);
    await addCategory(this.categoryRepository, categoryId, product);
    return await this.productRepository.save(product);
  }

  async removeCategory(id: number, categoryId: number) {
    const product = await this.getOne(id);
    removeCategory(product, categoryId);
    return await this.productRepository.save(product);
  }

  async changeBrand(id: number, brandId: number) {
    const product = await this.getOne(id);
    await changeEntityRelated(this.brandRepository, brandId, product);
    return await this.productRepository.save(product);
  }
}
