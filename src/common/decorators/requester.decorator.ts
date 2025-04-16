import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User as UserEntity } from 'src/user/entities/user.entity';
import jwt from 'jsonwebtoken';
import { UserLoaderPipe } from '../pipes/user-loader.pipe';

const requesterParamDecorator = createParamDecorator(
  (data, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user: UserEntity | undefined = request.user;
    if (!user && request.cookies?.accessToken) {
      const jwtSecret = process.env.JWT_SECRET as string;
      try {
        const decoded = jwt.verify(request.cookies.accessToken, jwtSecret);
        const userId = decoded.sub;
        return userId; // will be transformed to User in the pipe
      } finally {
      }
    }
    return user;
  },
);

/**
 * @description Get requester object from request
 */
export const Requester = () => requesterParamDecorator(UserLoaderPipe);
