import { MikroORM } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';
import { ContestNotFoundException } from 'src/common/exceptions/problem.exception';
import { ContestRepository } from '../repositories/contest.repository';
import { ContestService } from '../services/contest.service';

@Injectable()
export class ContestApplication {
  constructor(
    private orm: MikroORM,
    private contestRepository: ContestRepository,
    private contestService: ContestService,
  ) {}

  async getContestDetail(contestId: string) {
    const contest = await this.contestRepository.findOne(
      { id: contestId },
      {
        populate: ['problems', 'contestProblems.problem'],
      },
    );
    if (!contest) throw new ContestNotFoundException();

    return {
      id: contest.id,
      name: contest.name,
      type: contest.type,
      detailedType: contest.detailedType,
      platformContestId: contest.platformContestId,
      startedAt: contest.startedAt,
      durationSeconds: contest.durationSeconds,
      url: this.contestService.getContestUrl(contest),
      problems: contest.contestProblems.map((contestProblem) => ({
        id: contestProblem.problem.id,
        index: contestProblem.index,
        name: contestProblem.problem.name,
      })),
    };
  }
}
