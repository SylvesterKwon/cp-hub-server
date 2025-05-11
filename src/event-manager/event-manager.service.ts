import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ClsService } from 'nestjs-cls';
import { BaseEvent } from 'src/common/events/base.event';

@Injectable()
export class EventManagerService {
  constructor(
    private eventEmitter: EventEmitter2,
    private clsService: ClsService<{ queuedEvents?: BaseEvent[] }>,
  ) {}

  /**
   * Enqueue event to be emitted later.
   */
  enqueueEvent(event: BaseEvent) {
    const queuedEvents = this.clsService.get('queuedEvents') ?? [];
    queuedEvents.push(event);
    this.clsService.set('queuedEvents', queuedEvents);

    if (process.env.ENVIRONMENT === 'local')
      console.log('Event queued: ', event);
  }

  /**
   * Emit all queued events
   */
  emitAllEvents() {
    const queuedEvents = this.clsService.get('queuedEvents');
    if (!queuedEvents) return;
    queuedEvents.map((event) => {
      this.eventEmitter.emit(event.eventPattern, event);
    });

    if (process.env.ENVIRONMENT === 'local')
      console.log('Event emitted: ', queuedEvents);
  }
}
