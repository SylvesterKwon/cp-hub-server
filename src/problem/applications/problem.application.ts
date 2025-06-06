import { FilterQuery, MikroORM, OrderDefinition } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';
import { ProblemNotFoundException } from 'src/common/exceptions/problem.exception';
import { ProblemRepository } from '../repositories/problem.repository';
import { ContestRepository } from '../repositories/contest.repository';
import { Problem } from '../entities/problem.entity';
import { Contest } from '../entities/contest.entity';
import { ProblemListSortBy } from '../types/problem.type';

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
        detailedType: contest.detailedType,
      })),
      availableOnlineJudges: problem.availableOnlineJudges,
    };
  }

  async getProblemList(option: {
    page?: number;
    pageSize?: number;
    contestTypes?: string[];
    keyword?: string;
    sortBy?: ProblemListSortBy;
  }) {
    const filterQuery: FilterQuery<Problem> = {};
    if (option.keyword) {
      // TODO: Add full-text search (elasticsearch?)
      filterQuery.name = { $like: `${option.keyword}%` };
    }
    if (option.contestTypes) {
      filterQuery.containingContests = {
        type: { $in: option.contestTypes },
      } as FilterQuery<Contest>;
    }

    const page = option.page || 1;
    const pageSize = option.pageSize || 20;

    let orderDefinition: OrderDefinition<Problem> | undefined = undefined;
    if (option.sortBy === 'createdAtAsc') {
      orderDefinition = { createdAt: 'asc' };
    } else if (option.sortBy === 'updatedAtDesc') {
      orderDefinition = { updatedAt: 'desc' };
    }

    const [problems, totalCount] = await this.problemRepository.findAndCount(
      filterQuery,
      {
        populate: ['containingContests'],
        limit: pageSize,
        offset: (page - 1) * pageSize,
        orderBy: orderDefinition,
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
