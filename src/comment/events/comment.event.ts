import { BaseEvent } from 'src/common/events/base.event';
import { Comment } from '../entities/comment.entity';

export class CommentAddedEvent extends BaseEvent {
  eventPattern = 'comment.added';
  commentId: string;

  constructor(comment: Comment) {
    super();
    this.commentId = comment.id;
  }
}

export class CommentDeletedEvent extends BaseEvent {
  eventPattern = 'comment.deleted';
  commentId: string;

  constructor(comment: Comment) {
    super();
    this.commentId = comment.id;
  }
}

export class CommentUpdatedEvent extends BaseEvent {
  eventPattern = 'comment.updated';
  commentId: string;

  constructor(comment: Comment) {
    super();
    this.commentId = comment.id;
  }
}
