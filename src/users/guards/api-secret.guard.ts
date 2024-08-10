import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request } from 'express';
import { Reflector } from '@nestjs/core';
import { ROLE } from '../../auth/models/role.model';
import { ROLE_KEY } from '../../auth/decorators/role.decorator';

@Injectable()
export class ApiSecretGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const roles = this.reflector.get<ROLE[]>(ROLE_KEY, context.getHandler());

    const isSuperAdmin = roles.some((role) => role === ROLE.SUPERADMIN);

    const request = context.switchToHttp().getRequest<Request>();

    const apiSecret = request.header('api-secret');

    const isAuth = apiSecret === process.env.API_SECRET;

    if (!isAuth && !isSuperAdmin) {
      throw new UnauthorizedException('Unauthorized');
    }

    return true;
  }
}
