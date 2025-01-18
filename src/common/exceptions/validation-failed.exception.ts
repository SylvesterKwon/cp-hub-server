import { HttpStatus, ValidationError } from '@nestjs/common';
import { BaseException } from './base.exception';

/**
 * Exception for validation errors. It's automatically thrown by global validation pipe.
 */
export class ValidationFailedException extends BaseException {
  // TODO: Rather than passing validation errors as it is, process it into a more readable format.
  constructor(validationErrors: ValidationError[]) {
    super('VALIDATION_FAILED', HttpStatus.BAD_REQUEST, { validationErrors });
  }
}
