import { Injectable } from '@nestjs/common';
import { UserRepository } from '../repositories/user.repositories';
import { SignUpDto } from '../dtos/user.dto';
import bcrypt from 'bcrypt';
import { ValidationFailedException } from 'src/common/exceptions/validation-failed.exception';
import { ValidationErrorManager } from 'src/common/utils/validation-error-manager';

@Injectable()
export class UserService {
  constructor(private userRepository: UserRepository) {}

  async signUp(dto: SignUpDto) {
    // Validate
    const validationErrorManager = new ValidationErrorManager();
    if (await this.userRepository.findByEmail(dto.email))
      validationErrorManager.push('email', 'Email already exists');
    if (await this.userRepository.findByUsername(dto.username))
      validationErrorManager.push('username', 'Username already exists');
    const passwordValidationRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordValidationRegex.test(dto.password))
      validationErrorManager.push(
        'password',
        'Password must contain 8 letters at least with at least one uppercase letter, one lowercase letter, one number and one symbol',
      );
    if (dto.password !== dto.passwordConfirmation)
      validationErrorManager.push(
        'passwordConfirmation',
        'Please confirm your password correctly',
      );
    if (!validationErrorManager.isEmpty())
      throw new ValidationFailedException(
        validationErrorManager.validaitonErrors,
      );

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
