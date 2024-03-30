import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';

import { ValidateCredentialsGuard } from '../guards/validate-credentials.guard';
import { User } from 'src/users/entities/user.entity';
import { AuthService } from '../services/auth.service';
import {
  ChangePasswordDto,
  ForgotPasswordDto,
} from '../dtos/forgot-password.dto';
import { Role } from '../decorators/role.decorator';
import { ROLE } from '../models/role.model';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(ValidateCredentialsGuard, AuthGuard('local'))
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const user = req.user as User;

    const token = await this.authService.generateJwt(user);

    res.cookie(process.env.TOKEN_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      // sameSite: 'strict',
      path: '/',
      expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    });

    return 'Login success';
  }

  @Role(ROLE.SUPERADMIN, ROLE.SALESPERSON, ROLE.CUSTOMER)
  @Get('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    res.cookie(process.env.TOKEN_NAME, '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      // sameSite: 'strict',
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
