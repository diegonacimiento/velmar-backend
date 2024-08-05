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
import { User } from 'src/users/entities/user.entity';
import { AuthService } from '../services/auth.service';
import {
  ChangePasswordDto,
  ForgotPasswordDto,
} from '../dtos/forgot-password.dto';
import { Role } from '../decorators/role.decorator';
import { ROLE } from '../models/role.model';
import config from 'src/config';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    @Inject(config.KEY) private configService: ConfigType<typeof config>,
  ) {}

  @UseGuards(ValidateCredentialsGuard, AuthGuard('local'))
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const user = req.user as User;

    const token = await this.authService.generateJwt(user);

    res.cookie(this.configService.tokenName, token, {
      httpOnly: true,
      secure: this.configService.env === 'production',
      sameSite: 'strict',
      path: '/',
      expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      domain: this.configService.frontendDomain,
    });

    return {
      message: 'Login success',
      role: user.role,
    };
  }

  @Role(ROLE.SUPERADMIN, ROLE.SALESPERSON, ROLE.CUSTOMER)
  @Get('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    res.cookie(this.configService.tokenName, '', {
      httpOnly: true,
      secure: this.configService.env === 'production',
      sameSite: 'strict',
      path: '/',
      expires: new Date(Date.now() * 0),
      domain: this.configService.frontendDomain,
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
