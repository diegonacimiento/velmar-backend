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

import { User } from 'src/users/entities/user.entity';
import { PayloadToken } from '../models/token.model';
import { sendEmail } from 'src/utils/nodemailer';
import config from 'src/config';
import { ConfigType } from '@nestjs/config';
import {
  ChangePasswordDto,
  ForgotPasswordDto,
} from '../dtos/forgot-password.dto';

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
    const payload: PayloadToken = { role: user.role, sub: user.id };

    return {
      access_token: this.jwtService.sign(payload),
      user,
    };
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

      const link = `https://myfrontend.com/recovery?token=${token}`;

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

      const user = await this.userRepository.findOneBy({ id: payload.sub });

      if (user.recoveryToken !== token) {
        throw new UnauthorizedException();
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
