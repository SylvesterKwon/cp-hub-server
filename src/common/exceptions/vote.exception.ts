import { HttpStatus } from '@nestjs/common';
import { BaseException } from './base.exception';

class VoteException extends BaseException {
  constructor(errorCode: string, statusCode: HttpStatus) {
    super(['VOTE', errorCode].join(':'), statusCode);
  }
}

export class SelfVoteException extends VoteException {
  constructor() {
    super('SELF_VOTE', HttpStatus.BAD_REQUEST);
  }
}

export class DuplicatedVoteException extends VoteException {
  constructor() {
    super('DUPLICATED_VOTE', HttpStatus.BAD_REQUEST);
  }
}

export class VoteNotFoundException extends VoteException {
  constructor() {
    super('VOTE_NOT_FOUND', HttpStatus.NOT_FOUND);
  }
}
