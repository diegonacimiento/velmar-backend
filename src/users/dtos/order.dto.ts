import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsPositive } from 'class-validator';

export class CreateOrderDto {
  @ApiProperty()
  @IsPositive()
  @IsNotEmpty()
  readonly userId: number;
}

export class UpdateOrderDto extends PartialType(CreateOrderDto) {}
