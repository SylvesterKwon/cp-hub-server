import { MikroORM, Transactional } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';
import { CodeforcesSyncService } from '../services/codeforces-sync.service';
import { AtCoderSyncService } from '../services/atcoder-sync.service';

@Injectable()
export class ProblemSyncApplication {
  constructor(
    private orm: MikroORM,
    private codeforcesSyncService: CodeforcesSyncService,
    private atCoderSyncService: AtCoderSyncService,
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

  async syncAllCodeforcesContests() {
    await this.codeforcesSyncService.syncAllContests();
  }

  async syncAllAtCoderContests() {
    await this.atCoderSyncService.syncAllContests();
  }
}
