import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsPositive } from 'class-validator';
import { Size } from 'src/products/types/product';

export class CreateCartItemDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsPositive()
  readonly quantity: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(Size)
  readonly size: Size;

  @ApiProperty()
  @IsPositive()
  @IsOptional()
  readonly userId: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsPositive()
  readonly productId: number;
}

export class UpdateCartItemDto extends PartialType(CreateCartItemDto) {}
