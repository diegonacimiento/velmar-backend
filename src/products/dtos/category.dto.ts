import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
  IsUrl,
} from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsUrl()
  @IsNotEmpty()
  readonly image: string;

  @IsArray()
  @IsOptional()
  @IsPositive({ each: true })
  readonly brandsIds: number[];
}

export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {}
