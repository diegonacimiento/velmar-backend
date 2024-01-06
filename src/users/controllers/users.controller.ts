import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { UsersService } from '../services/users.service';
import { MyParseIntPipe } from 'src/common/my-parse-int/my-parse-int.pipe';
import { CreateUserDto, UpdateUserDto } from '../dtos/user.dto';
import { JwtGuard } from 'src/auth/guards/jwt.guard';

@ApiTags('users')
@UseGuards(JwtGuard)
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  async getAll() {
    return await this.usersService.getAll();
  }

  @Get(':id')
  async getOne(@Param('id', MyParseIntPipe) id: number) {
    return await this.usersService.getOne(id);
  }

  @Post()
  async create(@Body() payload: CreateUserDto) {
    return {
      message: 'User created',
      user: await this.usersService.create(payload),
    };
  }

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

  @Delete(':id')
  async delete(@Param('id', MyParseIntPipe) id: number) {
    return {
      message: 'User deleted',
      user: await this.usersService.delete(id),
    };
  }
}
