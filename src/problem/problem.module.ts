import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { Problem } from './entities/problem.entity';
import { Contest } from './entities/contest.entity';
import { CodeforcesSyncService } from './services/codeforces-sync.service';
import { CodeforcesClient } from './clients/codeforces.client';
import { HttpModule } from '@nestjs/axios';
import { Tag } from './entities/tag.entity';
import { CodeforcesService } from './services/codeforces.service';
import { ProblemSyncApplication } from './applications/problem-sync.applicaiton';
import { ContestProblems } from './entities/contest-problems.entity';

@Module({
  imports: [
    HttpModule,
    MikroOrmModule.forFeature({
      entities: [Problem, Contest, ContestProblems, Tag],
    }),
  ],
  providers: [
    ProblemSyncApplication,
    CodeforcesClient,
    CodeforcesSyncService,
    CodeforcesService,
  ],
  controllers: [],
  exports: [ProblemSyncApplication],
})
export class ProblemModule {}
