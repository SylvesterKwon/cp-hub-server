import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { UserApplication } from './user.application';
import { SignUpDto } from './dtos/user.dto';
import {
  AuthenticationRequired,
  PermissionRequired,
  RoleRequired,
} from 'src/common/decorators/auth.decorator';
import { Requester } from 'src/common/decorators/requester.decorator';
import { LocalAuthGuard } from './guards/local-auth.guards';
import { Response } from 'express';
import { User } from './entities/user.entity';

@Controller('user')
export class UserController {
  constructor(private userApplication: UserApplication) {}

  @UseGuards(LocalAuthGuard)
  @Post('sign-in')
  async signIn(
    @Requester() user: User,
    @Res({ passthrough: true }) response: Response,
    @Body('rememberMe') rememberMe?: boolean,
  ) {
    return await this.userApplication.signIn(response, user, rememberMe);
  }

  @Post('sign-up')
  async signUp(@Body() dto: SignUpDto) {
    return await this.userApplication.signUp(dto);
  }

  /** API for fetching basic information for current user */
  @Get('me')
  async getMe(@Requester() user?: User) {
    return await this.userApplication.getMe(user);
  }

  @Get(':username/detail')
  async getUserDetail(@Param('username') username: string) {
    return await this.userApplication.getUserDetail(username);
  }

  // TODO: 권한 확인용 임시 API, 삭제 할 것
  @AuthenticationRequired()
  @Get('auth-check')
  authCheck(@Requester() user: User) {
    return user;
  }

  // TODO: 권한 확인용 임시 API, 삭제 할 것
  @PermissionRequired('admin_permission_1')
  @Get('permission-check')
  permissionCheck(@Requester() user: User) {
    return user;
  }

  // TODO: 권한 확인용 임시 API, 삭제 할 것
  @RoleRequired('ADMIN')
  @Get('role-check')
  roleCheck(@Requester() user: User) {
    return user;
  }
}
