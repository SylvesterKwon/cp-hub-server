import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { EventManagerService } from 'src/event-manager/event-manager.service';

@Injectable()
export class EmitEventInterceptor implements NestInterceptor {
  constructor(private eventManagerService: EventManagerService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      tap((data) => {
        this.eventManagerService.emitAllEvents();
      }),
    );
  }
}
