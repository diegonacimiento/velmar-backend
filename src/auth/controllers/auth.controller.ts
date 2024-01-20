import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';
import { Request } from 'express';

import { ValidateCredentialsGuard } from '../guards/validate-credentials.guard';
import { User } from 'src/users/entities/user.entity';
import { AuthService } from '../services/auth.service';
import {
  ChangePasswordDto,
  ForgotPasswordDto,
} from '../dtos/forgot-password.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(ValidateCredentialsGuard, AuthGuard('local'))
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Req() req: Request) {
    const user = req.user as User;

    return await this.authService.generateJwt(user);
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
