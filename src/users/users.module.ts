import { Module } from '@nestjs/common';
import { OrdersController } from './controllers/orders.controller';
import { UsersController } from './controllers/users.controller';
import { OrdersService } from './services/orders.service';
import { UsersService } from './services/users.service';
import { ItemsOrderService } from './services/items-order.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { User } from './entities/user.entity';
import { ItemsOrderController } from './controllers/items-order.controller';
import { ItemOrder } from './entities/item-order.entity';
import { Product } from 'src/products/entities/product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Order, User, ItemOrder, Product])],
  controllers: [OrdersController, UsersController, ItemsOrderController],
  providers: [OrdersService, UsersService, ItemsOrderService],
})
export class UsersModule {}
