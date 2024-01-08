import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';

import { ROLE } from '../models/role.model';
import { ROLE_KEY } from '../decorators/role.decorator';
import { PayloadToken } from '../models/token.model';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const roles = this.reflector.get<ROLE[]>(ROLE_KEY, context.getHandler());

    if (!roles) return true;

    const request = context.switchToHttp().getRequest();

    const user = request.user as PayloadToken;

    const isAuth = roles.some((role) => role === user.role);

    if (!isAuth) {
      throw new UnauthorizedException(
        `You don't have permission to perform this action`,
      );
    }

    return isAuth;
  }
}
