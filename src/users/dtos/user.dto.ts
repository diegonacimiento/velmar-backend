import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';
import { ROLE } from 'src/auth/models/role.model';

export class CreateUserDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Matches(/^[a-zA-Z0-9_-]+$/, {
    message:
      'Invalid username. Only alphanumeric characters, hyphens, and underscores are allowed',
  })
  readonly username: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  readonly password: string;

  @IsEmail()
  @IsNotEmpty()
  readonly email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(4)
  readonly fullname: string;

  @IsString()
  @IsNotEmpty()
  @IsIn([ROLE.CUSTOMER, ROLE.SALESPERSON], {
    message: 'Role must be "customer" or "salesperson"',
  })
  readonly role: string;

  @IsPositive()
  @IsOptional()
  readonly phone: number;

  @IsString()
  @IsOptional()
  readonly address: string;
}

export class UpdateUserDto extends PartialType(CreateUserDto) {}
