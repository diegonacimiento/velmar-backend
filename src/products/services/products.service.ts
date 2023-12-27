import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto, UpdateProductDto } from '../dtos/product.dto';
import { Product } from '../entities/product.entity';

@Injectable()
export class ProductsService {
  private products: Product[] = [];
  private id: number = 1;

  async getAll() {
    return this.products;
  }

  async getOne(id: number) {
    const product = this.products.find((product) => product.id === id);
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return product;
  }

  async create(payload: CreateProductDto) {
    const body = {
      id: this.id++,
      ...payload,
    };
    this.products.push(body);
    return body;
  }

  async update(id: number, payload: UpdateProductDto) {
    const index = this.products.findIndex((product) => product.id === id);
    return (this.products[index] = {
      ...this.products[index],
      ...payload,
    });
  }

  async delete(id: number) {
    const productDeleted = this.getOne(id);
    this.products = this.products.filter((product) => product.id !== id);
    return productDeleted;
  }
}
