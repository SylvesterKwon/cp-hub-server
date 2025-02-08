import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * @description Get user object from request
 */
export const User = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;

    return data ? user?.[data] : user;
  },
);

/**
 * @description Get user id from request
 * Short abbreviation of User('id')
 */
export const UserId = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): number | null => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;
    return user?.id;
  },
);
