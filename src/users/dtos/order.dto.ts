import { ApiProperty, PickType } from '@nestjs/swagger';
import {
  ArrayNotEmpty,
  IsArray,
  IsBoolean,
  IsEnum,
  IsNotEmptyObject,
  IsObject,
  IsOptional,
  IsPositive,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

import { ORDER_STATUS } from '../model/order-status.model';
import { Size } from '../../products/types/product';

export class CreateOrderDto {
  @ApiProperty()
  @IsPositive()
  @IsOptional()
  readonly userId: number;

  @ApiProperty()
  @Type(() => Product)
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested()
  readonly cart: Product[];
}

export class UpdateOrderDto extends PickType(CreateOrderDto, ['userId']) {
  @ApiProperty()
  @IsEnum(ORDER_STATUS, { message: 'Status must be "in progress" or "sold"' })
  readonly status: string;
}

export class FilterOrderDto {
  @ApiProperty()
  @IsOptional()
  @IsPositive()
  limit: number;

  @ApiProperty()
  @IsOptional()
  @Min(0)
  offset: number;
}

class Brand {
  @ApiProperty()
  @IsPositive()
  readonly id: number;

  @ApiProperty()
  @IsString()
  readonly name: string;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  readonly isProtected: boolean;
}

class Product {
  @ApiProperty()
  @IsPositive()
  readonly id: number;

  @ApiProperty()
  @IsString()
  readonly name: string;

  @ApiProperty()
  @IsString()
  readonly price: string;

  @ApiProperty()
  @IsPositive()
  readonly quantity: number;

  @ApiProperty()
  @IsEnum(Size)
  readonly size: Size;

  @ApiProperty()
  @IsString()
  readonly color: string;

  @ApiProperty()
  @IsObject()
  @IsNotEmptyObject()
  @Type(() => Brand)
  @ValidateNested()
  readonly brand: Brand;
}
