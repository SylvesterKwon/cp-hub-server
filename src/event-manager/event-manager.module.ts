import { Global, Module } from '@nestjs/common';
import { EventManagerService } from './event-manager.service';

@Global()
@Module({
  imports: [],
  providers: [EventManagerService],
  exports: [EventManagerService],
})
export class EventManagerModule {}
