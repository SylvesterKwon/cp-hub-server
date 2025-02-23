import { Injectable } from '@nestjs/common';
import { ProblemRepository } from '../repositories/problem.repository';
import { ContestRepository } from '../repositories/contest.repository';
import { CodeforcesClient } from '../clients/codeforces.client';
import { ProblemSource } from '../entities/problem.entity';
import { CodeforcesService } from './codeforces.service';
import { ContestProblemsRepository } from '../repositories/contest-problems.repository';
import { delay } from 'src/common/utils/delay';
import { CreateRequestContext, MikroORM } from '@mikro-orm/core';

@Injectable()
export class CodeforcesSyncService {
  constructor(
    private orm: MikroORM,
    private codeforcesClient: CodeforcesClient,
    private codeforcesService: CodeforcesService,
    private problemRepository: ProblemRepository,
    private contestRepository: ContestRepository,
    private contestProblemsRepository: ContestProblemsRepository,
  ) {}
  @CreateRequestContext()
  async syncAllContests() {
    const getContestListResponse = await this.codeforcesClient.getContestList();
    const contestsData = getContestListResponse.result.filter(
      (contestData) => contestData.phase === 'FINISHED',
    );
    const unsuccesfulSyncContestIds = [];

    for (const contestData of contestsData) {
      try {
        await this.syncOneContest(contestData.id);
        this.contestRepository.getEntityManager().flush();
      } catch (e) {
        unsuccesfulSyncContestIds.push(contestData.id);
        console.error(`Failed to sync contest ${contestData.id}: ${e}`);
      }
      await delay(2000);
    }
    console.log('Finished syncing all Codeforces contests');
    console.log('Unsuccessful sync contest Ids: ', unsuccesfulSyncContestIds);
  }

  async syncOneContest(contestId: number) {
    console.log('Syncing Codeforces contest: ', contestId);
    // get contest & problems data
    const getContestStandingsResponse =
      await this.codeforcesClient.getContestStandings({
        contestId: contestId,
        count: 1,
      });
    const contestData = getContestStandingsResponse.result.contest;

    if (contestData.phase !== 'FINISHED')
      throw new Error(`Contest ${contestId} is not finished yet`);

    const { contestType, detailedContestType } =
      this.codeforcesService.classifyContestType(contestData.name);
    const problemsData = getContestStandingsResponse.result.problems;

    // sync contest
    const contest =
      await this.contestRepository.upsertByTypeAndPlatformContestId({
        name: contestData.name,
        platformContestId: contestData.id.toString(),
        type: contestType,
        detailedType: detailedContestType,
        startedAt: contestData.startTimeSeconds
          ? new Date(contestData.startTimeSeconds * 1000)
          : undefined,
        durationSeconds: contestData.durationSeconds,
      });

    // sync problems
    const problemsEntityData = problemsData.map((problemData) => ({
      name: problemData.name,
      source: ProblemSource.CF,
      availableOnlineJudges: [
        {
          url: this.codeforcesService.getProblemUrl(
            contestData.id,
            problemData.index,
          ),
        },
      ],
    }));
    const problems =
      await this.problemRepository.upsertManyByNameAndNearContest(
        problemsEntityData,
        contest,
      );
    await this.problemRepository.getEntityManager().flush(); // flush because fk constraint
    await this.contestProblemsRepository.setContestProblems(
      contest,
      problems.map((problem) => ({
        problem: problem,
        index: problemsData.find(
          (problemData) => problemData.name === problem.name,
        )?.index,
      })),
    );
    console.log('Successfully synced Codeforces contest: ', contestId);
    return contest;
  }
}
