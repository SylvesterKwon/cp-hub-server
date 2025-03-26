import {
  ExecutionContext,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { User } from '../entities/user.entity';
import { Reflector } from '@nestjs/core';
import { UserNotFoundException } from 'src/common/exceptions/user.exception';
import { AuthService } from '../auth.service';

@Injectable()
export class RoleGuard {
  constructor(
    private reflector: Reflector,
    private authService: AuthService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roleName = this.reflector.get<string>(
      'roleName',
      context.getHandler(),
    );
    if (!roleName) throw new InternalServerErrorException('Role not setted');
    const request = context.switchToHttp().getRequest();
    const user: User | undefined = request.user;
    if (!user) throw new UserNotFoundException();
    return await this.authService.checkIfUserInRole(user, roleName);
  }
}
