import { SetMetadata, UseGuards, applyDecorators } from '@nestjs/common';
import { JwtAuthGuard } from 'src/user/guards/jwt-auth.guard';
import { PermissionGuard } from 'src/user/guards/permission.guards';
import { RoleGuard } from 'src/user/guards/role.guards';

/**
 * @description Decorator that sets following route as authentication required
 */
export const AuthenticationRequired = () => UseGuards(JwtAuthGuard);

/**
 * @description Decorator that sets which permission is required to access the following route
 * @param permissionName name of permission
 */
export const PermissionRequired = (permissionName: string) =>
  applyDecorators(
    SetMetadata('permissionName', permissionName),
    UseGuards(JwtAuthGuard, PermissionGuard),
  );

/**
 * @description Decorator that sets which role is required to access the following route
 * @param roleName name of role
 */
export const RoleRequired = (roleName: string) =>
  applyDecorators(
    SetMetadata('roleName', roleName),
    UseGuards(JwtAuthGuard, RoleGuard),
  );
