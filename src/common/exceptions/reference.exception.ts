import { HttpStatus } from '@nestjs/common';
import { BaseException } from './base.exception';

class ReferenceException extends BaseException {
  constructor(errorCode: string, statusCode: HttpStatus) {
    super(['REFERENCE', errorCode].join(':'), statusCode);
  }
}

export class ReferenceSourceNotFoundException extends ReferenceException {
  constructor() {
    super('REFERENCE_SOURCE_NOT_FOUND', HttpStatus.NOT_FOUND);
  }
}

export class ReferenceTargetNotFoundException extends ReferenceException {
  constructor() {
    super('REFERENCE_TARGET_NOT_FOUND', HttpStatus.NOT_FOUND);
  }
}
