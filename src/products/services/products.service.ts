import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

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
} from '../../utils/shared-functions';
import { ROLE } from '../../auth/models/role.model';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product) private productRepository: Repository<Product>,
    @InjectRepository(Brand) private brandRepository: Repository<Brand>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  async getAll(params: FilterProductDto) {
    const {
      name,
      categories,
      brands,
      minPrice,
      maxPrice,
      limit = 10,
      offset = 0,
    } = params;

    let query = this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.brand', 'brand')
      .leftJoinAndSelect('product.categories', 'category');

    if (name) {
      query = query.andWhere('product.name ILIKE :name', { name: `%${name}%` });
    }

    if (categories && categories.length > 0) {
      const categoriesArray = Array.isArray(categories)
        ? categories
        : [categories];

      query = query.andWhere('category.id IN (:...categories)', {
        categories: categoriesArray,
      });
    }

    if (brands && brands.length > 0) {
      const brandsArray = Array.isArray(brands) ? brands : [brands];
      query = query.andWhere('brand.id IN (:...brands)', {
        brands: brandsArray,
      });
    }

    if (minPrice !== undefined) {
      query = query.andWhere('product.price >= :minPrice', { minPrice });
    }

    if (maxPrice !== undefined) {
      query = query.andWhere('product.price <= :maxPrice', { maxPrice });
    }

    query = query.skip(offset).take(limit);

    return query.getMany();
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

  async create(payload: CreateProductDto, role: ROLE) {
    const newProduct = this.productRepository.create(
      role === ROLE.SUPERADMIN ? { ...payload, isProtected: true } : payload,
    );

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

  async update(id: number, payload: UpdateProductDto, role: ROLE) {
    const product = await this.getOne(id);

    if (product.isProtected && role !== ROLE.SUPERADMIN) {
      throw new UnauthorizedException(
        'You do not have permission to perform this action',
      );
    }

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

  async delete(id: number, role: ROLE) {
    const product = await this.getOne(id);
    if (product.isProtected && role !== ROLE.SUPERADMIN) {
      throw new UnauthorizedException(
        'You do not have permission to perform this action',
      );
    }
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
