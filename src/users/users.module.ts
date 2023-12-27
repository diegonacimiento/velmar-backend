import { Module } from '@nestjs/common';
import { OrdersController } from './controllers/orders.controller';
import { UsersController } from './controllers/users.controller';
import { OrdersService } from './services/orders.service';
import { UsersService } from './services/users.service';

@Module({
  controllers: [OrdersController, UsersController],
  providers: [OrdersService, UsersService],
})
export class UsersModule {}
