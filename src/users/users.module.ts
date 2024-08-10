import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { OrdersController } from './controllers/orders.controller';
import { UsersController } from './controllers/users.controller';
import { OrdersService } from './services/orders.service';
import { UsersService } from './services/users.service';
import { Order } from './entities/order.entity';
import { User } from './entities/user.entity';
import { Product } from '../products/entities/product.entity';
import { CartsController } from './controllers/carts.controller';
import { CartItemsController } from './controllers/cart-items.controller';
import { CartItemsService } from './services/cart-items.service';
import { CartsService } from './services/carts.service';
import { Cart } from './entities/cart.entity';
import { CartItem } from './entities/cart-item.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Order, User, Cart, CartItem, Product])],
  controllers: [
    OrdersController,
    UsersController,
    CartsController,
    CartItemsController,
  ],
  providers: [OrdersService, UsersService, CartItemsService, CartsService],
})
export class UsersModule {}
