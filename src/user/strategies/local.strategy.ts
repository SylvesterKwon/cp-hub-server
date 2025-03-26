import { Injectable } from '@nestjs/common';
import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { UnauthorizedException } from 'src/common/exceptions/user.exception';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: 'email' });
  }

  async validate(id: string, password: string) {
    const user = await this.authService.validateUser(id, password);

    if (!user) throw new UnauthorizedException();
    return user;
  }
}
