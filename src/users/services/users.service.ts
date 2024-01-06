import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { User } from '../entities/user.entity';
import { CreateUserDto, UpdateUserDto } from '../dtos/user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async getAll() {
    return await this.userRepository.find();
  }

  async getOne(id: number) {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['orders'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async create(payload: CreateUserDto) {
    const newUser = this.userRepository.create(payload);

    const passwordHash = await bcrypt.hash(newUser.password, 10);

    newUser.password = passwordHash;

    return await this.userRepository.save(newUser);
  }

  async update(id: number, payload: UpdateUserDto) {
    const user = await this.getOne(id);

    this.userRepository.merge(user, payload);

    return await this.userRepository.save(user);
  }

  async delete(id: number) {
    const user = await this.getOne(id);
    await this.userRepository.delete(id);
    return user;
  }
}
