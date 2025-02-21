import { EntityRepository } from '@mikro-orm/postgresql';
import { ContestProblems } from '../entities/contest-problems.entity';
import { Contest } from '../entities/contest.entity';
import { Problem } from '../entities/problem.entity';

export class ContestProblemsRepository extends EntityRepository<ContestProblems> {
  async setContestProblems(
    contest: Contest,
    indexedProblems: { problem: Problem; index?: string }[],
  ) {
    const invalidContestProblem = await this.find({
      contest,
      problem: { $nin: indexedProblems.map((p) => p.problem) },
    });
    this.em.remove(invalidContestProblem);
    return this.upsertMany(
      indexedProblems.map((indexedProblem) => ({
        contest,
        problem: indexedProblem.problem,
        index: indexedProblem.index,
      })),
    );
  }
}
