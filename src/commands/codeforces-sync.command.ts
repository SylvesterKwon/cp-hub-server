import { Command, CommandRunner, Option } from 'nest-commander';
import { ProblemSyncApplication } from 'src/problem/applications/problem-sync.applicaiton';

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
    },
  ): Promise<void> {
    if (options?.round) {
      await this.problemSyncApplication.syncCodeforcesContest(options.round);
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
  parseType(val: string): number {
    return Number(val);
  }
}
