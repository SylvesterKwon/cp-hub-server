import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { CodeforcesSyncCommand } from './codeforces-sync.command';
import { ProblemModule } from 'src/problem/problem.module';
import { AtCoderSyncCommand } from './atcoder-sync.command';

@Module({
  imports: [MikroOrmModule.forRoot(), ProblemModule],
  providers: [CodeforcesSyncCommand, AtCoderSyncCommand],
  controllers: [],
})
export class CommandModule {}
