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
export class PermissionGuard {
  constructor(
    private reflector: Reflector,
    private authService: AuthService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const permissionName = this.reflector.get<string>(
      'permissionName',
      context.getHandler(),
    );
    if (!permissionName)
      throw new InternalServerErrorException('Permission not setted');
    const request = context.switchToHttp().getRequest();
    const user: User | undefined = request.user;
    if (!user) throw new UserNotFoundException();
    return await this.authService.checkIfUserHasPermission(
      user,
      permissionName,
    );
  }
}
