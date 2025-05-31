import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { CodeforcesSyncCommand } from './codeforces-sync.command';
import { ProblemModule } from 'src/problem/problem.module';
import { AtCoderSyncCommand } from './atcoder-sync.command';
import { EventManagerModule } from 'src/event-manager/event-manager.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ClsModule } from 'nestjs-cls';
import { ConfigModule } from '@nestjs/config';
import authConfig from 'src/config/auth.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [`.env`],
      load: [authConfig],
      isGlobal: true,
    }),
    MikroOrmModule.forRoot(),
    EventManagerModule,
    EventEmitterModule.forRoot(),
    ClsModule.forRoot({
      middleware: {
        mount: true,
      },
      global: true,
    }),
    ProblemModule,
  ],
  providers: [CodeforcesSyncCommand, AtCoderSyncCommand],
})
export class CommandModule {}
