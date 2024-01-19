import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsPositive } from 'class-validator';

export class CreateCartDto {
  @ApiProperty()
  @IsPositive()
  @IsOptional()
  readonly userId: number;
}

export class UpdateCartDto extends CreateCartDto {}
