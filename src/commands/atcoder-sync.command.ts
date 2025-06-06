import { Command, CommandRunner, Option } from 'nest-commander';
import { ProblemSyncApplication } from 'src/problem/applications/problem-sync.application';

@Command({
  name: 'sync-atcoder',
  description: 'Sync AtCoder contest & problems ',
})
export class AtCoderSyncCommand extends CommandRunner {
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
    if (options?.all) {
      await this.problemSyncApplication.syncAllAtCoderContests();
    }
  }

  @Option({
    flags: '-a --all',
    description: 'Sync every round',
  })
  parseAllFlag(val?: string): boolean {
    return val === undefined || val === 'true';
  }
}
