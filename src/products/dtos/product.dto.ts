import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayNotEmpty,
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';

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
}

class ImageDto {
  @IsString()
  color: string;

  @IsArray()
  @Type(() => String)
  urls: string[];
}
