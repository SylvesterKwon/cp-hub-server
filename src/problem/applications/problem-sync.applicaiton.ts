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
    try {
      await this.codeforcesSyncService.syncOneContest(contestId);
    } catch (e) {
      console.error(
        `Failed to sync Codeforces contest (ID: ${contestId}): ${e}`,
      );
    }
  }

  // @Transactional()
  async syncAllCodeforcesContests() {
    await this.codeforcesSyncService.syncAllContests();
    // console.log(`Succesfully synced all Codeforces contest`);
  }
}
