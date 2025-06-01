import { FilterQuery, MikroORM } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';
import { ContestNotFoundException } from 'src/common/exceptions/problem.exception';
import { ContestRepository } from '../repositories/contest.repository';
import { ContestService } from '../services/contest.service';
import { Contest, ContestType } from '../entities/contest.entity';

@Injectable()
export class ContestApplication {
  constructor(
    private orm: MikroORM,
    private contestRepository: ContestRepository,
    private contestService: ContestService,
  ) {}

  async getContestList(contestFilter: {
    page?: number;
    pageSize?: number;
    types?: ContestType[];
    keyword?: string;
  }) {
    const filterQuery: FilterQuery<Contest> = {};
    if (contestFilter.keyword) {
      // TODO: Add full-text search (elasticsearch?)
      filterQuery.name = { $like: `${contestFilter.keyword}%` };
    }
    if (contestFilter.types) {
      filterQuery.type = { $in: contestFilter.types };
    }

    const page = contestFilter.page || 1;
    const pageSize = contestFilter.pageSize || 20;
    const [contests, totalCount] = await this.contestRepository.findAndCount(
      filterQuery,
      {
        limit: pageSize,
        offset: (page - 1) * pageSize,
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
