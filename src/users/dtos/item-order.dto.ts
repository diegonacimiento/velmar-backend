import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsPositive } from 'class-validator';

export class CreateItemOrderDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsPositive()
  readonly quantity: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsPositive()
  readonly orderId: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsPositive()
  readonly productId: number;
}

export class UpdateItemOrderDto extends PartialType(CreateItemOrderDto) {}
