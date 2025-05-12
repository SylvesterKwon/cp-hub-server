import { ReferenceApplication } from './applications/reference.application';
import { OnEvents } from 'src/common/decorators/on-events.decorator';
import { ReferenceSourceType } from './entities/reference.entity';
import {
  CommentAddedEvent,
  CommentDeletedEvent,
  CommentUpdatedEvent,
} from 'src/comment/events/comment.event';
import { Controller } from '@nestjs/common';
import {
  EditorialAddedEvent,
  EditorialDeletedEvent,
  EditorialUpdatedEvent,
} from 'src/problem/events/editorial.event';
import { OnEvent } from '@nestjs/event-emitter';

@Controller()
export class ReferenceEventListener {
  constructor(private referenceApplication: ReferenceApplication) {}

  @OnEvents(['comment.added', 'comment.updated'])
  async handleCommentAddedAndUpdated(
    payload: CommentAddedEvent | CommentUpdatedEvent,
  ) {
    return await this.referenceApplication.updateReference(
      ReferenceSourceType.COMMENT,
      payload.commentId,
    );
  }

  @OnEvent('comment.deleted')
  async handleCommentDeleted(payload: CommentDeletedEvent) {
    return await this.referenceApplication.deleteReference(
      ReferenceSourceType.COMMENT,
      payload.commentId,
    );
  }

  @OnEvents(['editorial.added', 'editorial.updated'])
  async handleEditorialAddedAndUpdated(
    payload: EditorialAddedEvent | EditorialUpdatedEvent,
  ) {
    return await this.referenceApplication.updateReference(
      ReferenceSourceType.EDITORIAL,
      payload.editorialId,
    );
  }

  @OnEvent('editorial.deleted')
  async handleEditorialDeleted(payload: EditorialDeletedEvent) {
    return await this.referenceApplication.deleteReference(
      ReferenceSourceType.EDITORIAL,
      payload.editorialId,
    );
  }
}
