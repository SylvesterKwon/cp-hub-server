import { HttpStatus } from '@nestjs/common';
import { BaseException } from './base.exception';

class ProblemException extends BaseException {
  constructor(errorCode: string, statusCode: HttpStatus) {
    super(['PROBLEM', errorCode].join(':'), statusCode);
  }
}

export class ProblemNotFoundException extends ProblemException {
  constructor() {
    super('PROBLEM_NOT_FOUND', HttpStatus.NOT_FOUND);
  }
}

export class ContestNotFoundException extends ProblemException {
  constructor() {
    super('CONTEST_NOT_FOUND', HttpStatus.NOT_FOUND);
  }
}
