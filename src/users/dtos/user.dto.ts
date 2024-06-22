import { ApiProperty, OmitType, PartialType, PickType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsNotEmptyObject,
  IsObject,
  IsOptional,
  IsPositive,
  IsString,
  Matches,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { ROLE } from 'src/auth/models/role.model';

class AddressDto {
  @IsOptional()
  @IsString()
  street: string;

  @IsOptional()
  @IsString()
  apartment: string;

  @IsOptional()
  @IsString()
  city: string;

  @IsOptional()
  @IsString()
  state: string;

  @IsOptional()
  @IsString()
  country: string;
}

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

  @IsObject({ each: true })
  @IsNotEmptyObject()
  @Type(() => AddressDto)
  @ValidateNested({ each: true })
  @IsOptional()
  readonly address: AddressDto;
}

export class UpdateUserDto extends PartialType(
  OmitType(CreateUserDto, ['password']),
) {}

export class UpdatePasswordDto extends PickType(CreateUserDto, ['password']) {
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  readonly newPassword: string;
}
