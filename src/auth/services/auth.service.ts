import {
  ConflictException,
  Inject,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';

import { User } from '../../users/entities/user.entity';
import { PayloadToken } from '../models/token.model';
import { sendEmail } from '../../utils/nodemailer';
import config from '../../config';
import { ConfigType } from '@nestjs/config';
import {
  ChangePasswordDto,
  ForgotPasswordDto,
} from '../dtos/forgot-password.dto';
import { ROLE } from '../models/role.model';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private jwtService: JwtService,
    @Inject(config.KEY) private configService: ConfigType<typeof config>,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.userRepository.findOne({ where: { email } });

    if (!user) return null;

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) return null;

    delete user.password;

    return user;
  }

  async generateJwt(user: User) {
    const payload: PayloadToken = {
      role: ROLE[user.role.toUpperCase()],
      sub: user.id,
    };

    return this.jwtService.sign(payload);
  }

  async sendEmail({ email }: ForgotPasswordDto) {
    try {
      const user = await this.userRepository.findOne({ where: { email } });
      if (!user) {
        throw new UnauthorizedException();
      }

      const payload = { sub: user.id };

      const token = this.jwtService.sign(payload, {
        expiresIn: '15 min',
        secret: this.configService.jwtSecretRecovery,
      });

      const link = `${this.configService.frontendUrl}/recovery?token=${token}`;

      user.recoveryToken = token;

      await this.userRepository.save(user);

      await sendEmail({ email, link, user: user.fullname });
      return { message: 'Email sent' };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async changePassword(body: ChangePasswordDto) {
    try {
      const { token, newPassword } = body;
      const payload = this.jwtService.verify(token, {
        secret: this.configService.jwtSecretRecovery,
      });

      const user = await this.userRepository.findOne({
        where: { id: payload.sub },
        select: { id: true, recoveryToken: true },
      });

      if (user.recoveryToken !== token) {
        throw new UnauthorizedException('Token already used');
      }

      const passwordHashed = await bcrypt.hash(newPassword, 10);

      user.password = passwordHashed;
      user.recoveryToken = null;

      await this.userRepository.save(user);

      return { message: 'Password has been changed successfully' };
    } catch (error) {
      console.log(error);
      if (error.message === 'jwt expired') {
        throw new ConflictException('Token expired');
      } else {
        throw new InternalServerErrorException(error.message);
      }
    }
  }
}
