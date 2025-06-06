import { FilterQuery, MikroORM, OrderDefinition } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';
import { ContestNotFoundException } from 'src/common/exceptions/problem.exception';
import { ContestRepository } from '../repositories/contest.repository';
import { ContestService } from '../services/contest.service';
import { Contest, ContestType } from '../entities/contest.entity';
import { ContestListSortBy } from '../types/contest.type';

@Injectable()
export class ContestApplication {
  constructor(
    private orm: MikroORM,
    private contestRepository: ContestRepository,
    private contestService: ContestService,
  ) {}

  async getContestList(option: {
    page?: number;
    pageSize?: number;
    types?: ContestType[];
    keyword?: string;
    sortBy?: ContestListSortBy;
  }) {
    const filterQuery: FilterQuery<Contest> = {};
    if (option.keyword) {
      // TODO: Add full-text search (elasticsearch?)
      filterQuery.name = { $like: `${option.keyword}%` };
    }
    if (option.types) {
      filterQuery.type = { $in: option.types };
    }

    const page = option.page || 1;
    const pageSize = option.pageSize || 20;

    let orderDefinition: OrderDefinition<Contest> | undefined = undefined;
    if (option.sortBy === 'createdAtAsc') {
      orderDefinition = { createdAt: 'asc' };
    } else if (option.sortBy === 'updatedAtDesc') {
      orderDefinition = { updatedAt: 'desc' };
    }

    const [contests, totalCount] = await this.contestRepository.findAndCount(
      filterQuery,
      {
        limit: pageSize,
        offset: (page - 1) * pageSize,
        orderBy: orderDefinition,
      },
    );

    return {
      results: contests.map((contest) => ({
        id: contest.id,
        name: contest.name,
        type: contest.type,
        detailedType: contest.detailedType,
        platformContestId: contest.platformContestId,
        startedAt: contest.startedAt,
        durationSeconds: contest.durationSeconds,
      })),
      totalCount,
    };
  }

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
