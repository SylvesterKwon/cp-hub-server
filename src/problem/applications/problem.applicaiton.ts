import { FilterQuery, MikroORM } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';
import { ProblemNotFoundException } from 'src/common/exceptions/problem.exception';
import { ProblemRepository } from '../repositories/problem.repository';
import { ContestRepository } from '../repositories/contest.repository';
import { Problem } from '../entities/problem.entity';
import { Contest } from '../entities/contest.entity';

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

  async getProblemList(problemFilter: {
    page?: number;
    pageSize?: number;
    contestTypes?: string[];
    keyword?: string;
  }) {
    const filterQuery: FilterQuery<Problem> = {};
    if (problemFilter.keyword) {
      // TODO: Add full-text search (elasticsearch?)
      filterQuery.name = { $like: `${problemFilter.keyword}%` };
    }
    if (problemFilter.contestTypes) {
      filterQuery.containingContests = {
        type: { $in: problemFilter.contestTypes },
      } as FilterQuery<Contest>;
      // filterQuery.genres = { $in: problemFilter.genreIds };
    }

    const page = problemFilter.page || 1;
    const pageSize = problemFilter.pageSize || 20;
    const [problems, totalCount] = await this.problemRepository.findAndCount(
      filterQuery,
      {
        populate: ['containingContests'],
        limit: pageSize,
        offset: (page - 1) * pageSize,
      },
    );

    return {
      results: problems.map((problem) => ({
        id: problem.id,
        name: problem.name,
        containingContests: problem.containingContests.map((contest) => ({
          id: contest.id,
          name: contest.name,
          type: contest.type,
        })),
      })),
      totalCount,
    };
  }
}
