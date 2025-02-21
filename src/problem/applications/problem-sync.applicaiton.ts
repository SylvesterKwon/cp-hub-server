import { MikroORM, Transactional } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';
import { CodeforcesSyncService } from '../services/codeforces-sync.service';

@Injectable()
export class ProblemSyncApplication {
  constructor(
    private orm: MikroORM,
    private codeforcesSyncService: CodeforcesSyncService,
  ) {}

  @Transactional()
  async syncCodeforcesContest(contestId: number) {
    const contest = await this.codeforcesSyncService.syncOneContest(contestId);
    console.log(`Succesfully synced Codeforces contest (ID: ${contest.id})`);
  }

  @Transactional()
  async syncAllCodeforcesContests() {
    await this.codeforcesSyncService.syncAllContests();
    console.log(`Succesfully synced all Codeforces contest`);
  }
}
