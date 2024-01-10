import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsPositive } from 'class-validator';

export class CreateCartDto {
  @ApiProperty()
  @IsPositive()
  @IsNotEmpty()
  readonly userId: number;
}

export class UpdateCartDto extends PartialType(CreateCartDto) {}
