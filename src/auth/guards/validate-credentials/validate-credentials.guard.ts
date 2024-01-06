import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';

@Injectable()
export class ValidateCredentialsGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    const { email, password } = request.body;

    if (!email && !password) {
      throw new UnauthorizedException('Email and password fields are required');
    }

    if (!email) {
      throw new UnauthorizedException('Email field is required');
    }

    if (!password) {
      throw new UnauthorizedException('Password field is required');
    }

    return true;
  }
}
