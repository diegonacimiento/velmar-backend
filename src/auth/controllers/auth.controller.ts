import {
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

import { ValidateCredentialsGuard } from '../guards/validate-credentials/validate-credentials.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  @UseGuards(ValidateCredentialsGuard, AuthGuard('local'))
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Req() req: Request) {
    console.log('pepe');
    return req.user;
  }
}
