import {
  CanActivate, ExecutionContext, Injectable,
} from '@nestjs/common';

@Injectable()
export class CsrfGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    const csrfFromHeader = req.headers['x-csrf-token'];
    const csrfFromCookie = req.cookies['csrf_token'];

    return csrfFromHeader === csrfFromCookie;
  }
}
