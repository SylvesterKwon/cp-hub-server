import { Injectable } from '@nestjs/common';
import { UserRepository } from '../repositories/user.repositories';
import { SignUpDto } from '../dtos/user.dto';
import {
  EmailAlreadyExistsException,
  UsernameAlreadyExistsException,
} from 'src/common/exceptions/user.exception';
import bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private userRepository: UserRepository) {}

  async signUp(dto: SignUpDto) {
    if (await this.userRepository.findByEmail(dto.email))
      throw new UsernameAlreadyExistsException();
    else if (await this.userRepository.findByEmail(dto.email))
      throw new EmailAlreadyExistsException();

    const hashedPassword = await this.hashPassword(dto.password);

    const user = this.userRepository.create({
      username: dto.username,
      email: dto.email,
      hashedPassword,
    });

    return user;
  }

  private async hashPassword(password: string) {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
  }
}
