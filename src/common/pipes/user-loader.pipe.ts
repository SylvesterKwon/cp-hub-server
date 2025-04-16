import {
  Injectable,
  PipeTransform,
  UnauthorizedException,
} from '@nestjs/common';
import { User } from 'src/user/entities/user.entity';
import { UserRepository } from 'src/user/repositories/user.repositories';

@Injectable()
export class UserLoaderPipe implements PipeTransform {
  constructor(private userRepository: UserRepository) {}

  async transform(value: User | string | undefined) {
    if (value instanceof User) return value;
    else if (typeof value === 'string') {
      const user = await this.userRepository.findById(value);
      if (!user) throw new UnauthorizedException();
      return user;
    } else return undefined;
  }
}
