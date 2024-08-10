import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Brand } from '../entities/brand.entity';
import { CreateBrandDto, UpdateBrandDto } from '../dtos/brand.dto';
import {
  addCategory,
  addManyEntities,
  removeCategory,
} from '../../utils/shared-functions';
import { Category } from '../entities/category.entity';
import { ROLE } from '../../auth/models/role.model';

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

  async create(payload: CreateBrandDto, role: ROLE) {
    const newBrand = this.brandRepository.create(
      role === ROLE.SUPERADMIN ? { ...payload, isProtected: true } : payload,
    );
    if (payload.categoriesIds) {
      await addManyEntities(
        this.categoryRepository,
        payload.categoriesIds,
        newBrand,
      );
    }
    return await this.brandRepository.save(newBrand);
  }

  async update(id: number, payload: UpdateBrandDto, role: ROLE) {
    const brand = await this.getOne(id);
    if (brand.isProtected && role !== ROLE.SUPERADMIN) {
      throw new UnauthorizedException(
        'You do not have permission to perform this action',
      );
    }
    this.brandRepository.merge(brand, payload);
    return await this.brandRepository.save(brand);
  }

  async delete(id: number, role: ROLE) {
    const brand = await this.getOne(id);
    if (brand.isProtected && role !== ROLE.SUPERADMIN) {
      throw new UnauthorizedException(
        'You do not have permission to perform this action',
      );
    }
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
