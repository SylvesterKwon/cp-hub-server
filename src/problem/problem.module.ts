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
import { ContestApplication } from './applications/contest.applicaiton';
import { EditorialService } from './services/editorial.service';
import { Editorial } from './entities/editorial.entity';
import { UserModule } from 'src/user/user.module';
import { EditorialApplication } from './applications/editorial.application';
import { User } from 'src/user/entities/user.entity';
import { EditorialVotes } from './entities/editorial-votes.entity';
import { VoteService } from './services/vote.service';
import { EditorialController } from './controllers/editorial.controller';
import { ReferenceModule } from 'src/reference/reference.module';
import { Comment } from 'src/comment/entities/comment.entity';

@Module({
  imports: [
    HttpModule,
    MikroOrmModule.forFeature({
      entities: [
        Problem,
        Contest,
        ContestProblems,
        Tag,
        Editorial,
        User,
        EditorialVotes,
        Comment,
      ],
    }),
    UserModule,
    ReferenceModule,
  ],
  providers: [
    // Applications
    ProblemSyncApplication,
    EditorialApplication,
    ProblemApplication,
    ContestApplication,

    // Services
    CodeforcesSyncService,
    CodeforcesService,
    AtCoderSyncService,
    AtCoderService,
    ProblemService,
    ContestService,
    EditorialService,
    VoteService,

    // Clients
    CodeforcesClient,
    AtCoderProblemsClient,
  ],
  controllers: [ContestController, ProblemController, EditorialController],
  exports: [ProblemSyncApplication],
})
export class ProblemModule {}
