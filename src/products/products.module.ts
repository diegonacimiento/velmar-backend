import { Module } from '@nestjs/common';
import { BrandsController } from './controllers/brands.controller';
import { CategoriesController } from './controllers/categories.controller';
import { ProductsController } from './controllers/products.controller';

@Module({
  controllers: [BrandsController, CategoriesController, ProductsController],
})
export class ProductsModule {}
