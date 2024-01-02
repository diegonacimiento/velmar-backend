import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto, UpdateProductDto } from '../dtos/product.dto';
import { Product } from '../entities/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product) private productRepository: Repository<Product>,
  ) {}

  async getAll() {
    return this.productRepository.find();
  }

  async getOne(id: number) {
    const product = this.productRepository.findOne({ where: { id } });
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return product;
  }

  async create(payload: CreateProductDto) {
    const newProduct = this.productRepository.create(payload);
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
}
