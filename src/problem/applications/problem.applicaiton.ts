import { MikroORM } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';
import { ProblemNotFoundException } from 'src/common/exceptions/problem.exception';
import { ProblemRepository } from '../repositories/problem.repository';
import { ContestRepository } from '../repositories/contest.repository';

@Injectable()
export class ProblemApplication {
  constructor(
    private orm: MikroORM,
    private problemRepository: ProblemRepository,
    private contestRepository: ContestRepository,
  ) {}

  async getProblemDetail(problemId: string) {
    const problem = await this.problemRepository.findOne(
      { id: problemId },
      { populate: ['tags', 'containingContests'] },
    );
    if (!problem) throw new ProblemNotFoundException();

    return {
      id: problem.id,
      name: problem.name,
      tags: problem.tags.map((tag) => tag.name),
      containingContests: problem.containingContests.map((contest) => ({
        id: contest.id,
        name: contest.name,
        type: contest.type,
      })),
      availableOnlineJudges: problem.availableOnlineJudges,
    };
  }
}
