import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Reflector } from '@nestjs/core';
import { UserRepository } from '../repositories/user.repositories';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  // reference: https://docs.nestjs.com/recipes/passport#implementing-passport-jwt
  constructor(
    private configService: ConfigService,
    private userRepository: UserRepository,
    private reflector: Reflector,
  ) {
    const jwtSecret = configService.get<string>('auth.jwtSecret');
    if (!jwtSecret) throw new Error('jwtSecret is not defined');
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtSecret,
    });
  }

  async validate(payload: any) {
    console.log('payload', payload);
    const user = await this.userRepository.findById(payload.sub);
    if (!user) throw new UnauthorizedException();
    return user;
  }
}
