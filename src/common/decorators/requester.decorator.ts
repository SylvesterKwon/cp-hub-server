import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User as UserEntity } from 'src/user/entities/user.entity';

/**
 * @description Get user object from request
 */
export const Requester = createParamDecorator<keyof UserEntity | undefined>(
  (data, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user: UserEntity | undefined = request.user;
    return data ? user?.[data] : user;
  },
);

/**
 * @description Get user id from request
 * Short abbreviation of User('id')
 */
export const RequesterId = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): number | null => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;
    return user?.id;
  },
);
