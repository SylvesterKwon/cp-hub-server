import { Injectable, NotImplementedException } from '@nestjs/common';
import { UserService } from './services/user.service';
import { RegisterDto } from './dtos/user.dto';
import { Transactional } from '@mikro-orm/core';
import { UserNotFoundException } from 'src/common/exceptions/user.exception';
import { AuthService } from './auth.service';
import { UserRepository } from './repositories/user.repositories';

@Injectable()
export class UserApplication {
  constructor(
    private userService: UserService,
    private authService: AuthService,
    private userRepository: UserRepository,
  ) {}

  async login(userId: string) {
    const user = await this.userRepository.findById(userId);
    if (!user) throw new UserNotFoundException();

    const res = await this.authService.login(user);
    return {
      message: 'Logged in successfully.',
      ...res,
    };
  }

  @Transactional()
  async register(dto: RegisterDto) {
    await this.userService.register(dto);
  }

  async getUserProfile(username: string) {
    throw new NotImplementedException();
  }
}
