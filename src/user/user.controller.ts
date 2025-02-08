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
import { AuthenticationRequired } from 'src/common/decorators/auth.decorator';
import { UserId } from 'src/common/decorators/user.decorator';
import { LocalAuthGuard } from './guards/local-auth.guards';
import { Response } from 'express';

@Controller('user')
export class UserController {
  constructor(private userApplication: UserApplication) {}

  @UseGuards(LocalAuthGuard)
  @Post('sign-in')
  async signIn(
    @UserId() userId: string,
    @Res({ passthrough: true }) response: Response,
    @Body('rememberMe') rememberMe?: boolean,
  ) {
    return await this.userApplication.signIn(response, userId, rememberMe);
  }

  @Post('sign-up')
  async signUp(@Body() dto: SignUpDto) {
    return await this.userApplication.signUp(dto);
  }

  @Get(':username/profile')
  async getUserProfile(@Param('usernmae') username: string) {
    return await this.userApplication.getUserProfile(username);
  }

  // TODO: 권한 확인용 임시 API, 삭제 할 것
  @AuthenticationRequired()
  @Get('auth-check')
  authCheck(@UserId() userId: number) {
    return userId;
  }

  // TODO: 권한 확인용 임시 API, 삭제 할 것
  // @PermissionRequired('admin_only_permission_1')
  // @Get('admin')
  // getAdminPage(@UserId() userId: number) {
  //   return userId;
  // }
}
