import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';

import { Product } from '../entities/product.entity';
import {
  CreateProductDto,
  FilterProductDto,
  UpdateProductDto,
} from '../dtos/product.dto';
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

  async getAll(params: FilterProductDto) {
    const { limit = 5, offset = 0 } = params;
    return await this.productRepository.find({
      relations: { brand: true },
      skip: offset,
      take: limit,
    });
  }

  async getOne(id: number) {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: { brand: true, categories: true },
    });
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return product;
  }

  async getByName(name: string) {
    const products = await this.productRepository.find({
      where: { name: ILike(`%${name}%`) },
    });
    if (products.length === 0) {
      throw new NotFoundException('Product not found');
    }
    return products;
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
    if (payload.categoriesIds) {
      product.categories = [];
      for (const categoryId of payload.categoriesIds) {
        await addCategory(this.categoryRepository, categoryId, product);
      }
    }
    if (payload.brandId || payload.brandId === null) {
      payload.brandId === null
        ? (product.brand = null)
        : await changeEntityRelated(
            this.brandRepository,
            payload.brandId,
            product,
          );
    }
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
