import { Injectable } from '@nestjs/common';
import { ProblemRepository } from '../repositories/problem.repository';
import { ContestRepository } from '../repositories/contest.repository';
import { ContestProblemsRepository } from '../repositories/contest-problems.repository';
import { CreateRequestContext, MikroORM } from '@mikro-orm/core';
import {
  AtCoderProblemsClient,
  AtCoderProblemsContestInformation,
  AtCoderProblemsProblemInformation,
} from '../clients/atcoder-problems.client';
import { delay } from 'src/common/utils/delay';
import { AtCoderService } from './atcoder.service';

@Injectable()
export class AtCoderSyncService {
  constructor(
    private orm: MikroORM,
    private atCoderService: AtCoderService,
    private atCoderProblemsClient: AtCoderProblemsClient,
    private problemRepository: ProblemRepository,
    private contestRepository: ContestRepository,
    private contestProblemsRepository: ContestProblemsRepository,
  ) {}
  @CreateRequestContext()
  async syncAllContests() {
    const contestsData =
      await this.atCoderProblemsClient.getContestsInformation();
    delay(2000);
    const problemsData =
      await this.atCoderProblemsClient.getProblemsInformation();
    delay(2000);
    const contestProblemPairsData =
      await this.atCoderProblemsClient.getPairsOfContestsAndProblems();

    const unsuccesfulSyncContestIds: string[] = [];
    for (const contestData of contestsData) {
      try {
        await this.orm.em.transactional(async () => {
          const selectedPairs = contestProblemPairsData.filter(
            (pair) => pair.contest_id === contestData.id,
          );
          await this.syncOneContest(
            contestData,
            selectedPairs.map((pair) => {
              const problemInfo = problemsData.find(
                (problem) => problem.id === pair.problem_id,
              );
              if (!problemInfo)
                throw new Error(`Problem ${pair.problem_id} not found`);
              return {
                index: pair.problem_index,
                problemInfo: problemInfo,
              };
            }),
          );
        });
      } catch (e) {
        unsuccesfulSyncContestIds.push(contestData.id);
        console.error(`Failed to sync contest ${contestData.id}: ${e}`);
      }
      await delay(2000);
    }
    console.log('Finished syncing all AtCoder contests');
    console.log('Unsuccessful sync contest Ids: ', unsuccesfulSyncContestIds);
  }

  async syncOneContest(
    contestData: AtCoderProblemsContestInformation,
    problemsData: {
      index: string;
      problemInfo: AtCoderProblemsProblemInformation;
    }[],
  ) {
    console.log('Syncing AtCoder contest: ', contestData.id);
    // if (contestData.phase !== 'FINISHED')
    //   throw new Error(`Contest ${contestId} is not finished yet`);

    // const { contestType, detailedContestType } =
    //   this.codeforcesService.classifyContestType(contestData.name);
    // const problemsData = getContestStandingsResponse.result.problems;

    // sync contest
    const { contestType, detailedContestType } =
      this.atCoderService.classifyContestType(contestData);
    const contest =
      await this.contestRepository.upsertByTypeAndPlatformContestId({
        name: contestData.title,
        platformContestId: contestData.id.toString(),
        type: contestType,
        detailedType: detailedContestType,
        startedAt: new Date(contestData.start_epoch_second * 1000),
        durationSeconds: contestData.duration_second,
      });

    // sync problems
    const problemsEntityData = problemsData.map((problemData) => ({
      name: problemData.problemInfo.name,
      availableOnlineJudges: [
        {
          url: this.atCoderService.getProblemUrl(
            contestData.id,
            problemData.problemInfo.id,
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
          (problemData) => problemData.problemInfo.name === problem.name,
        )?.index,
      })),
    );
    console.log('Successfully synced AtCoder contest: ', contest.id);
    return contest;
  }
}
