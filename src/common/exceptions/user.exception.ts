import { HttpStatus } from '@nestjs/common';
import { BaseException } from './base.exception';

class UserException extends BaseException {
  constructor(errorCode: UserErrorCode, statusCode: HttpStatus) {
    super(['USER', errorCode].join(':'), statusCode);
  }
}

export class UsernameAlreadyExistsException extends UserException {
  constructor() {
    super(UserErrorCode.USERNAME_ALREADY_EXISTS, HttpStatus.BAD_REQUEST);
  }
}

export class EmailAlreadyExistsException extends UserException {
  constructor() {
    super(UserErrorCode.EMAIL_ALREADY_EXISTS, HttpStatus.BAD_REQUEST);
  }
}

export class InvalidPasswordException extends UserException {
  constructor() {
    super(UserErrorCode.INVALID_PASSWORD, HttpStatus.BAD_REQUEST);
  }
}

export class UnauthenticatedException extends UserException {
  constructor() {
    super(UserErrorCode.UNAUTHENTICATED, HttpStatus.UNAUTHORIZED);
  }
}

export class UnauthorizedException extends UserException {
  constructor() {
    super(UserErrorCode.UNAUTHORIZED, HttpStatus.UNAUTHORIZED);
  }
}

export class UserNotFoundException extends UserException {
  constructor() {
    super(UserErrorCode.USER_NOT_FOUND, HttpStatus.NOT_FOUND);
  }
}

// TODO: remove enum
export enum UserErrorCode {
  USERNAME_ALREADY_EXISTS = 'USERNAME_ALREADY_EXISTS',
  EMAIL_ALREADY_EXISTS = 'EMAIL_ALREADY_EXISTS',
  INVALID_PASSWORD = 'INVALID_PASSWORD',
  UNAUTHENTICATED = 'UNAUTHENTICATED',
  UNAUTHORIZED = 'UNAUTHORIZED',
  USER_NOT_FOUND = 'USER_NOT_FOUND',
}
