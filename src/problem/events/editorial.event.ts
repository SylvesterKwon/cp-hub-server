import { BaseEvent } from 'src/common/events/base.event';
import { Editorial } from '../entities/editorial.entity';

export class EditorialAddedEvent extends BaseEvent {
  eventPattern = 'editorial.added';
  editorialId: string;

  constructor(editorial: Editorial) {
    super();
    this.editorialId = editorial.id;
  }
}

export class EditorialDeletedEvent extends BaseEvent {
  eventPattern = 'editorial.deleted';
  editorialId: string;

  constructor(editorial: Editorial) {
    super();
    this.editorialId = editorial.id;
  }
}

export class EditorialUpdatedEvent extends BaseEvent {
  eventPattern = 'editorial.updated';
  editorialId: string;

  constructor(editorial: Editorial) {
    super();
    this.editorialId = editorial.id;
  }
}
