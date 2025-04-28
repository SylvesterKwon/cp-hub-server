import { HttpStatus } from '@nestjs/common';
import { BaseException } from 'src/common/exceptions/base.exception';

class CommentException extends BaseException {
  constructor(errorCode: string, statusCode: HttpStatus) {
    super(['COMMENT', errorCode].join(':'), statusCode);
  }
}

export class ParentCommentNotFoundException extends CommentException {
  constructor() {
    super('PARENT_COMMENT_NOT_FOUND', HttpStatus.BAD_REQUEST);
  }
}

export class CommentContextNotFoundException extends CommentException {
  constructor() {
    super('COMMENT_CONTEXT_NOT_FOUND', HttpStatus.BAD_REQUEST);
  }
}

export class CommentNotFoundException extends CommentException {
  constructor() {
    super('COMMENT_NOT_FOUND', HttpStatus.NOT_FOUND);
  }
}

export class CommentDepthExceedsLimitException extends CommentException {
  constructor() {
    super('COMMENT_DEPTH_EXCEEDS_LIMIT', HttpStatus.BAD_REQUEST);
  }
}
