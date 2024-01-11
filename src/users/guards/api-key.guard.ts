import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    const apiKey = request.header('api-key');

    const isAuth = apiKey === process.env.API_KEY;

    if (!isAuth) {
      throw new UnauthorizedException('Unauthorized');
    }

    return isAuth;
  }
}
