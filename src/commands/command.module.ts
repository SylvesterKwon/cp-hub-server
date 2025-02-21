import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { CodeforcesSyncCommand } from './codeforces-sync.command';
import { ProblemModule } from 'src/problem/problem.module';

@Module({
  imports: [MikroOrmModule.forRoot(), ProblemModule],
  providers: [CodeforcesSyncCommand],
  controllers: [],
})
export class CommandModule {}
