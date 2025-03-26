import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { UserRepository } from 'src/user/repositories/user.repositories';
import bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { PermissionRepository } from './repositories/permission.repository';

@Injectable()
export class AuthService {
  constructor(
    private userRepository: UserRepository,
    private jwtService: JwtService,
    private permissionRepository: PermissionRepository,
  ) {}
  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userRepository.findByEmail(email);
    if (user && (await bcrypt.compare(password, user.hashedPassword)))
      return user;
    else return null;
  }

  signIn(user: User, rememberMe?: boolean) {
    const payload = { username: user.username, sub: user.id };
    return this.jwtService.sign(payload, {
      expiresIn: rememberMe ? '30 days' : '1 days',
    });
  }

  async checkIfUserHasPermission(
    user: User,
    permissionName: string,
  ): Promise<boolean> {
    const role = await user.role?.load();
    if (!role) return false; // user has no role
    const rolePermissions = await role.permissions?.init();
    if (!rolePermissions) return false;
    const permission =
      await this.permissionRepository.findByName(permissionName);
    if (!permission)
      throw new InternalServerErrorException(
        `Permission '${permissionName}'not found.`,
      );
    return rolePermissions.contains(permission);
  }

  async checkIfUserInRole(user: User, roleName: string): Promise<boolean> {
    const role = await user.role?.load();
    if (!role) return false; // user has no role
    return role.name === roleName;
  }
}
