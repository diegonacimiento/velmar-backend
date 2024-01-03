import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  ArrayNotEmpty,
  IsArray,
  IsNotEmpty,
  IsPositive,
  IsString,
  IsUrl,
} from 'class-validator';

export class CreateBrandDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsUrl()
  @IsNotEmpty()
  readonly image: string;

  @IsArray()
  @IsPositive({ each: true })
  @ArrayNotEmpty()
  readonly categoriesIds: number[];
}

export class UpdateBrandDto extends PartialType(CreateBrandDto) {}
