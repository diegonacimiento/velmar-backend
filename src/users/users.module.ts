import { Module } from '@nestjs/common';
import { OrdersController } from './controllers/orders.controller';
import { UsersController } from './controllers/users.controller';

@Module({
  controllers: [OrdersController, UsersController],
})
export class UsersModule {}
