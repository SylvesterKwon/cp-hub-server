import { Injectable, NotImplementedException } from '@nestjs/common';
import { UserService } from './services/user.service';
import { SignUpDto } from './dtos/user.dto';
import { Transactional } from '@mikro-orm/core';
import { AuthService } from './auth.service';
import { UserRepository } from './repositories/user.repositories';
import { Response } from 'express';
import { User } from './entities/user.entity';

@Injectable()
export class UserApplication {
  constructor(
    private userService: UserService,
    private authService: AuthService,
    private userRepository: UserRepository,
  ) {}

  async signIn(response: Response, user: User, rememberMe?: boolean) {
    const accessToken = this.authService.signIn(user, rememberMe);
    const expiresDate = new Date();
    expiresDate.setDate(expiresDate.getDate() + (rememberMe ? 30 : 1));

    response.cookie('accessToken', accessToken, {
      httpOnly: true,
      expires: expiresDate,
    });
    response.cookie('userId', user.id, {
      expires: expiresDate,
    });
    response.cookie('username', user.username, {
      expires: expiresDate,
    });

    return {
      message: 'Logged in successfully.',
      accessToken: accessToken,
      userId: user.id,
      username: user.username,
    };
  }

  @Transactional()
  async signUp(dto: SignUpDto) {
    await this.userService.signUp(dto);
  }

  async getUserProfile(username: string) {
    throw new NotImplementedException();
  }
}
