import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsPositive } from 'class-validator';
import { ORDER_STATUS } from '../model/order-status.model';

export class CreateOrderDto {
  @ApiProperty()
  @IsPositive()
  readonly userId: number;
}

export class UpdateOrderDto extends CreateOrderDto {
  @ApiProperty()
  @IsEnum(ORDER_STATUS, { message: 'Status must be "in progress" or "sold"' })
  readonly status: string;
}
