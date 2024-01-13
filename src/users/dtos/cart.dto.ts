import { ApiProperty } from '@nestjs/swagger';
import { IsPositive } from 'class-validator';

export class CreateCartDto {
  @ApiProperty()
  @IsPositive()
  readonly userId: number;
}

export class UpdateCartDto extends CreateCartDto {}
