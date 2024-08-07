import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayNotEmpty,
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { Size } from '../types/product';

export class CreateProductDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsString()
  @IsNotEmpty()
  readonly description: string;

  @IsPositive()
  @IsNotEmpty()
  readonly price: number;

  @IsArray()
  @ArrayMaxSize(8)
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => ImageDto)
  readonly images: ImageDto[];

  @IsPositive()
  @IsOptional()
  readonly brandId: number;

  @IsArray()
  @ArrayMaxSize(3)
  @IsOptional()
  @IsPositive({ each: true })
  readonly categoriesIds: number[];
}

export class UpdateProductDto extends PartialType(CreateProductDto) {}

export class FilterProductDto {
  @ApiProperty()
  @IsOptional()
  @IsPositive()
  limit: number;

  @ApiProperty()
  @IsOptional()
  @Min(0)
  offset: number;

  @ApiProperty()
  @IsOptional()
  @IsString()
  name: string;

  @ApiProperty()
  @IsOptional()
  categories: number[];

  @ApiProperty()
  @IsOptional()
  brands: number[];

  @ApiProperty()
  @IsOptional()
  @IsPositive()
  minPrice: number;

  @ApiProperty()
  @IsOptional()
  @IsPositive()
  maxPrice: number;
}

class ImageDto {
  @IsString()
  color: string;

  @IsArray()
  @Type(() => String)
  urls: string[];

  @IsArray()
  @IsEnum(Size, { each: true })
  sizes: Size[];
}
