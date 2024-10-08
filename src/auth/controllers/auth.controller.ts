import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { ConfigType } from '@nestjs/config';

import { ValidateCredentialsGuard } from '../guards/validate-credentials.guard';
import { User } from '../../users/entities/user.entity';
import { AuthService } from '../services/auth.service';
import {
  ChangePasswordDto,
  ForgotPasswordDto,
} from '../dtos/forgot-password.dto';
import { Role } from '../decorators/role.decorator';
import { ROLE } from '../models/role.model';
import config from '../../config';
import { JwtService } from '@nestjs/jwt';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    @Inject(config.KEY) private configService: ConfigType<typeof config>,
    private jwtService: JwtService,
  ) {}

  @UseGuards(ValidateCredentialsGuard, AuthGuard('local'))
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const user = req.user as User;

    const token = await this.authService.generateJwt(user);

    const { exp } = this.jwtService.decode(token);

    const expires = new Date(exp * 1000);

    res.cookie(this.configService.tokenName, token, {
      httpOnly: true,
      secure: this.configService.env === 'production',
      sameSite: 'none',
      path: '/',
      expires,
    });

    return {
      message: 'Login success',
      role: user.role,
      token,
    };
  }

  @Role(ROLE.SUPERADMIN, ROLE.SALESPERSON, ROLE.CUSTOMER)
  @Get('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    res.cookie(this.configService.tokenName, '', {
      httpOnly: true,
      secure: this.configService.env === 'production',
      sameSite: 'none',
      path: '/',
      expires: new Date(Date.now() * 0),
    });

    return 'Logout success';
  }

  @Post('forgot-password')
  async forgotPassword(@Body() payload: ForgotPasswordDto) {
    return await this.authService.sendEmail(payload);
  }

  @Post('change-password')
  async changePassword(@Body() payload: ChangePasswordDto) {
    return await this.authService.changePassword(payload);
  }
}
