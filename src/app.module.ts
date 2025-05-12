import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import authConfig from './config/auth.config';
import { ProblemModule } from './problem/problem.module';
import { CommentModule } from './comment/comment.module';
import { ReferenceModule } from './reference/reference.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { EventManagerModule } from './event-manager/event-manager.module';
import { ClsModule } from 'nestjs-cls';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { EmitEventInterceptor } from './common/events/emit-event.interceptor';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [`.env`],
      load: [authConfig],
      isGlobal: true,
    }),
    EventManagerModule,
    EventEmitterModule.forRoot(),
    ClsModule.forRoot({
      middleware: {
        mount: true,
      },
      global: true,
    }),
    MikroOrmModule.forRoot(),
    UserModule,
    ProblemModule,
    CommentModule,
    ReferenceModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: EmitEventInterceptor,
    },
  ],
})
export class AppModule {}
