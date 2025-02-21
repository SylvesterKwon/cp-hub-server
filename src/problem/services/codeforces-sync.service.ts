import { Injectable } from '@nestjs/common';
import { ProblemRepository } from '../repositories/problem.repository';
import { ContestRepository } from '../repositories/contest.repository';
import { CodeforcesClient } from '../clients/codeforces.client';
import { ContestType } from '../entities/contest.entity';
import { ProblemSource } from '../entities/problem.entity';
import { CodeforcesService } from './codeforces.service';
import { ContestProblemsRepository } from '../repositories/contest-problems.repository';

@Injectable()
export class CodeforcesSyncService {
  constructor(
    private codeforcesClient: CodeforcesClient,
    private codeforcesService: CodeforcesService,
    private problemRepository: ProblemRepository,
    private contestRepository: ContestRepository,
    private contestProblemsRepository: ContestProblemsRepository,
  ) {}
  async syncAllContests() {
    // const getContestListResponse = await this.codeforcesClient.getContestList();
    // const contestsData = getContestListResponse.result;
    // WIP
  }

  async syncOneContest(contestId: number) {
    // get contest & problems data
    const getContestStandingsResponse =
      await this.codeforcesClient.getContestStandings({
        contestId: contestId,
        count: 1,
      });
    const contestData = getContestStandingsResponse.result.contest;
    const problemsData = getContestStandingsResponse.result.problems;

    // sync contest
    const contest = await this.contestRepository.upsertByTypeAndName({
      name: contestData.name,
      platformContestId: contestData.id.toString(),
      type: codeforcesContestToContestTypeMapping[contestData.type],
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
    return contest;
  }
}

export const codeforcesContestToContestTypeMapping = {
  CF: ContestType.CF,
  IOI: ContestType.IOI,
  ICPC: ContestType.ICPC,
};
