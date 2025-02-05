import { SetMetadata, UseGuards, applyDecorators } from '@nestjs/common';
import { JwtAuthGuard } from 'src/user/guards/jwt-auth.guard';

/**
 * @description Decorator that sets following route as authentication required
 */
export const AuthenticationRequired = () => UseGuards(JwtAuthGuard);

/**
 * @description Decorator that sets which permission is required to access the following route
 * @param permissionName name of permission
 */
// export const PermissionRequired = (permissionName: string) =>
//   applyDecorators(
//     SetMetadata('permission', permissionName),
//     UseGuards(JwtAuthGuard, PermissionGuard),
//   );
