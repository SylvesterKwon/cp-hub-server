import { HttpStatus } from '@nestjs/common';
import { BaseException } from './base.exception';

export class UnhandledException extends BaseException {
  constructor() {
    super('UNHANDLED', HttpStatus.INTERNAL_SERVER_ERROR);
  }
}
