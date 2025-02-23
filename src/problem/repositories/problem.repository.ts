import {
  EntityRepository,
  FilterQuery,
  RequiredEntityData,
} from '@mikro-orm/postgresql';
import { Problem } from '../entities/problem.entity';
import { checkContestHasStartedAt, Contest } from '../entities/contest.entity';
import dayjs from 'dayjs';

export class ProblemRepository extends EntityRepository<Problem> {
  async findById(id: string): Promise<Problem | null> {
    return await this.findOne({ id });
  }

  /**
   * Upsert problems by its name and "near" contest
   * (near contest means the contest started at the same time as the given contest)
   * */
  async upsertManyByNameAndNearContest(
    dataList: RequiredEntityData<Problem>[],
    contest: Contest,
  ) {
    const filterQuery: FilterQuery<Problem> & {
      containingContests: { $or: FilterQuery<Contest>[] };
    } = {
      containingContests: {
        $or: [
          {
            name: contest.name,
            type: contest.type,
            platformContestId: contest.platformContestId,
          },
        ],
      },
    };

    if (checkContestHasStartedAt(contest)) {
      const contestStartedAt = dayjs(contest.startedAt);
      filterQuery.containingContests['$or'].push({
        startedAt: {
          $gte: contestStartedAt.add(-1, 'hour').toDate(),
          $lte: contestStartedAt.add(1, 'hour').toDate(),
        },
      });
    }

    const nearProblems = await this.find(filterQuery);
    return dataList.map((data) => {
      const existingProblem = nearProblems.find(
        (problem) => problem.name === data.name,
      );
      if (existingProblem) {
        // TODO: Merge Tags, AvailableOnlineJudges
        return this.assign(existingProblem, data);
      } else return this.create(data);
    });
  }
}
