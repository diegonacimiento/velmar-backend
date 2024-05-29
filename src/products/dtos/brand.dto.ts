import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';

export class CreateBrandDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsArray()
  @IsPositive({ each: true })
  @IsOptional()
  readonly categoriesIds: number[];
}

export class UpdateBrandDto extends PartialType(CreateBrandDto) {}
