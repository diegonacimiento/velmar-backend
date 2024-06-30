import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { User } from '../entities/user.entity';
import {
  CreateUserDto,
  UpdatePasswordDto,
  UpdateUserDto,
} from '../dtos/user.dto';
import { Cart } from '../entities/cart.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private dataSource: DataSource,
  ) {}

  async getAll() {
    return await this.userRepository.find();
  }

  async getOne(id: number) {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: { orders: true },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async create(payload: CreateUserDto) {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const newUser = this.userRepository.create(payload);

      const passwordHash = await bcrypt.hash(newUser.password, 10);

      newUser.password = passwordHash;

      await queryRunner.manager.save(User, newUser);

      const newCart = new Cart();

      newCart.user = newUser;

      await queryRunner.manager.save(Cart, newCart);

      await queryRunner.commitTransaction();

      return newUser;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async update(id: number, payload: UpdateUserDto) {
    const user = await this.getOne(id);

    this.userRepository.merge(user, payload);

    return await this.userRepository.save(user);
  }

  async updatePassword(id: number, payload: UpdatePasswordDto) {
    const user = await this.userRepository.findOne({
      where: { id },
      select: { id: true, password: true },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isMatch = await bcrypt.compare(payload.password, user.password);

    if (!isMatch) {
      throw new UnauthorizedException('Incorrect password');
    }

    const hash = await bcrypt.hash(payload.newPassword, 10);

    this.userRepository.merge(user, { password: hash });

    return await this.userRepository.save(user);
  }

  async delete(id: number) {
    const user = await this.getOne(id);
    await this.userRepository.delete(id);
    return user;
  }
}
