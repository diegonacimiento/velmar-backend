import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { UsersService } from '../services/users.service';
import { MyParseIntPipe } from 'src/common/my-parse-int/my-parse-int.pipe';
import { CreateUserDto, UpdateUserDto } from '../dtos/user.dto';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { RoleGuard } from 'src/auth/guards/role.guard';
import { Role } from 'src/auth/decorators/role.decorator';
import { ROLE } from 'src/auth/models/role.model';
import { Public } from 'src/auth/decorators/public.decorator';
import { Request } from 'express';
import { PayloadToken } from 'src/auth/models/token.model';

@ApiTags('users')
@UseGuards(JwtGuard, RoleGuard)
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Role(ROLE.SUPERADMIN)
  @Get()
  async getAll() {
    return await this.usersService.getAll();
  }

  @Role(ROLE.SUPERADMIN, ROLE.SALESPERSON, ROLE.CUSTOMER)
  @Get('profile')
  async getMyUser(@Req() req: Request) {
    const user = req.user as PayloadToken;
    return await this.usersService.getOne(user.sub);
  }

  @Role(ROLE.SUPERADMIN)
  @Get(':id')
  async getOne(@Param('id', MyParseIntPipe) id: number) {
    return await this.usersService.getOne(id);
  }

  @Public()
  @Post()
  async create(@Body() payload: CreateUserDto) {
    return {
      message: 'User created',
      user: await this.usersService.create(payload),
    };
  }

  @Role(ROLE.SUPERADMIN)
  @Put(':id')
  async update(
    @Param('id', MyParseIntPipe) id: number,
    @Body() payload: UpdateUserDto,
  ) {
    return {
      message: 'User updated',
      user: await this.usersService.update(id, payload),
    };
  }

  @Role(ROLE.SUPERADMIN, ROLE.SALESPERSON, ROLE.CUSTOMER)
  @Put()
  async updateMyUser(@Body() payload: UpdateUserDto, @Req() req: Request) {
    const user = req.user as PayloadToken;
    return {
      message: 'User updated',
      user: await this.usersService.update(user.sub, payload),
    };
  }

  @Role(ROLE.SUPERADMIN)
  @Delete(':id')
  async delete(@Param('id', MyParseIntPipe) id: number) {
    return {
      message: 'User deleted',
      user: await this.usersService.delete(id),
    };
  }

  @Role(ROLE.SUPERADMIN, ROLE.SALESPERSON, ROLE.CUSTOMER)
  @Delete()
  async deleteMyUser(@Req() req: Request) {
    const user = req.user as PayloadToken;
    return {
      message: 'User deleted',
      user: await this.usersService.delete(user.sub),
    };
  }
}
