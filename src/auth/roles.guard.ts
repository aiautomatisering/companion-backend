import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserResponseDto } from 'src/user/dto/user.dto';
import { ROLES_KEY } from './roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()]
    );

    if (!requiredRoles) {
      return true;
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const { user: requestUser } = context.switchToHttp().getRequest();
    const user = requestUser as UserResponseDto;

    let hasAccess = false;

    for (const item of user.roles) {
      if (requiredRoles.includes(item.role?.name)) {
        hasAccess = true;
        break;
      }
    }

    return hasAccess;
  }
}
