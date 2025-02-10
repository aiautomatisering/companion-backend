import { createParamDecorator, ExecutionContext } from '@nestjs/common';

// Models and interfaces
import { UserResponseDto } from './dto/user.dto';

export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): UserResponseDto => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const request = ctx.switchToHttp().getRequest();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    return request.user as UserResponseDto;
  }
);
