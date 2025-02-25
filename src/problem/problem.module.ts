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
import { AtCoderProblemsClient } from './clients/atcoder-problems.client';
import { AtCoderSyncService } from './services/atcoder-sync.service';
import { AtCoderService } from './services/atcoder.service';
import { ProblemController } from './controllers/problem.controller';
import { ContestController } from './controllers/contest.controller';
import { ProblemApplication } from './applications/problem.applicaiton';
import { ContestService } from './services/contest.service';
import { ProblemService } from './services/problem.service';

@Module({
  imports: [
    HttpModule,
    MikroOrmModule.forFeature({
      entities: [Problem, Contest, ContestProblems, Tag],
    }),
  ],
  providers: [
    // Applications
    ProblemSyncApplication,
    ProblemApplication,

    // Services
    CodeforcesSyncService,
    CodeforcesService,
    AtCoderSyncService,
    AtCoderService,
    ProblemService,
    ContestService,

    // Clients
    CodeforcesClient,
    AtCoderProblemsClient,
  ],
  controllers: [ContestController, ProblemController],
  exports: [ProblemSyncApplication],
})
export class ProblemModule {}
