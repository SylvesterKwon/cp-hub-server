import { Injectable } from '@nestjs/common';
import { UserRepository } from 'src/user/repositories/user.repositories';
import bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private userRepository: UserRepository,
    private jwtService: JwtService,
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
}
