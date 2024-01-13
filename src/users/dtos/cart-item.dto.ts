import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsPositive } from 'class-validator';

export class CreateCartItemDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsPositive()
  readonly quantity: number;

  @ApiProperty()
  @IsPositive()
  readonly userId: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsPositive()
  readonly productId: number;
}

export class UpdateCartItemDto extends PartialType(CreateCartItemDto) {}
