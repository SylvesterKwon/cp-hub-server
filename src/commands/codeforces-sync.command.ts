import { Command, CommandRunner, Option } from 'nest-commander';
import { ProblemSyncApplication } from 'src/problem/applications/problem-sync.application';

@Command({
  name: 'sync-cf',
  description: 'Sync Codeforces contest & problems ',
})
export class CodeforcesSyncCommand extends CommandRunner {
  constructor(private problemSyncApplication: ProblemSyncApplication) {
    super();
  }

  async run(
    passedParam: string[],
    options?: {
      round?: number;
      all?: boolean;
    },
  ): Promise<void> {
    if (options?.round) {
      await this.problemSyncApplication.syncCodeforcesContest(options.round);
    } else if (options?.all) {
      await this.problemSyncApplication.syncAllCodeforcesContests();
    }
  }

  @Option({
    flags: '-r --round [number]',
    description: 'Sync single round',
  })
  parseRoundNumber(val: string): number {
    return Number(val);
  }

  @Option({
    flags: '-a --all',
    description: 'Sync every round',
  })
  parseAllFlag(val?: string): boolean {
    return val === undefined || val === 'true';
  }
}
