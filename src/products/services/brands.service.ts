import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Brand } from '../entities/brand.entity';
import { CreateBrandDto, UpdateBrandDto } from '../dtos/brand.dto';
import {
  addCategory,
  addManyEntities,
  removeCategory,
} from 'src/utils/shared-functions';
import { Category } from '../entities/category.entity';

@Injectable()
export class BrandsService {
  constructor(
    @InjectRepository(Brand) private brandRepository: Repository<Brand>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  async getAll() {
    return await this.brandRepository.find();
  }

  async getOne(id: number) {
    const brand = await this.brandRepository.findOne({
      where: { id },
      relations: { categories: true },
    });
    if (!brand) {
      throw new NotFoundException('Brand not found');
    }
    return brand;
  }

  async create(payload: CreateBrandDto) {
    const newBrand = this.brandRepository.create(payload);
    if (payload.categoriesIds) {
      await addManyEntities(
        this.categoryRepository,
        payload.categoriesIds,
        newBrand,
      );
    }
    return await this.brandRepository.save(newBrand);
  }

  async update(id: number, payload: UpdateBrandDto) {
    const brand = await this.getOne(id);
    this.brandRepository.merge(brand, payload);
    return await this.brandRepository.save(brand);
  }

  async delete(id: number) {
    const brand = await this.getOne(id);
    await this.brandRepository.delete(id);
    return brand;
  }

  async addCategory(id: number, categoryId: number) {
    const brand = await this.getOne(id);
    await addCategory(this.categoryRepository, categoryId, brand);
    return await this.brandRepository.save(brand);
  }

  async removeCategory(id: number, categoryId: number) {
    const brand = await this.getOne(id);
    removeCategory(brand, categoryId);
    return await this.brandRepository.save(brand);
  }
}
