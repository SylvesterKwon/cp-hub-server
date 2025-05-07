import { BadRequestException, Injectable } from '@nestjs/common';
import { User } from 'src/user/entities/user.entity';
import { EditorialRepository } from '../repositories/editorial.repository';
import { Problem } from '../entities/problem.entity';
import { Editorial } from '../entities/editorial.entity';
import { UnauthorizedException } from 'src/common/exceptions/user.exception';
import { RoleType } from 'src/user/entities/role.entity';
import { AuthService } from 'src/user/auth.service';
import { FilterQuery, OrderDefinition, raw } from '@mikro-orm/core';
import { EditorialVotesRepository } from '../repositories/editorial-votes.repository';
import { EditorialListSortBy } from '../types/editorial.type';
import dayjs, { Dayjs } from 'dayjs';

@Injectable()
export class EditorialService {
  constructor(
    private editorialRepository: EditorialRepository,
    private authService: AuthService,
    private editorialVotesRepository: EditorialVotesRepository,
  ) {}

  halfLifeInHours = 24; // for exponential decay score
  coolingRate = Math.log(2) / this.halfLifeInHours;

  async updateEditorial(user: User, problem: Problem, content: string) {
    const existingEditorial = await this.editorialRepository.findOne({
      problem,
      author: user,
    });
    if (existingEditorial) {
      existingEditorial.content = content;
      return existingEditorial;
    } else {
      const editorial = this.editorialRepository.create({
        problem,
        author: user,
        content,
      });
      // set initial wilson score interval
      this.calculateWilsonScoreInterval(editorial);

      // invalidate EDS cache when new editorial posted
      problem.additionalInfo.exponentialDecayScoreCachedValueUpdatedAt = null;
      return editorial;
    }
  }

  async deleteEditorial(user: User, editorial: Editorial) {
    const isAdmin = await this.authService.checkIfUserInRole(
      user,
      RoleType.ADMIN,
    );
    if (!isAdmin && editorial.author.id !== user.id)
      throw new UnauthorizedException();
    const em = this.editorialRepository.getEntityManager();
    return await em.removeAndFlush(editorial);
  }

  async getEditorialList(option: {
    author?: User;
    problem?: Problem;
    page?: number;
    pageSize?: number;
    sortBy?: EditorialListSortBy;
  }) {
    const filterQuery: FilterQuery<Editorial> = {};
    const page = option.page || 1;
    const pageSize = option.pageSize || 10;

    let orderDefinition: OrderDefinition<Editorial> | undefined = undefined;
    if (option.sortBy === 'trending') {
      if (!option.problem)
        throw new BadRequestException(
          'Sort by trending is only available when problem condition is provided',
        );

      const exponentialDecayScoreCachedValueUpdatedAt =
        option.problem?.additionalInfo
          .exponentialDecayScoreCachedValueUpdatedAt;
      const currentTime = dayjs();
      if (
        !exponentialDecayScoreCachedValueUpdatedAt ||
        dayjs(exponentialDecayScoreCachedValueUpdatedAt)
          .add(1, 'hour')
          .isBefore(currentTime)
      ) {
        // When cache is invalidated
        await this.recalculateExponentialDecayScoreCache(option.problem);
      }
      orderDefinition = {
        [raw(
          `("denormalized_info"->'exponentialDecayScore'->'cachedValue')::float`,
        )]: 'desc',
      };
    } else if (option.sortBy === 'createdAtAsc') {
      orderDefinition = {
        createdAt: 'asc',
      };
    } else if (option.sortBy === 'updatedAtDesc') {
      orderDefinition = {
        updatedAt: 'desc',
      };
    } else {
      // Sort by recommended (default behavior)
      orderDefinition = {
        denormalizedInfo: {
          wilsonScoreInterval: {
            lowerBound: 'desc',
          },
        },
      };
    }

    if (option.problem) filterQuery.problem = option.problem;
    if (option.author) filterQuery.author = option.author;

    const [editorials, totalCount] =
      await this.editorialRepository.findAndCount(filterQuery, {
        populate: ['author'],
        limit: pageSize,
        offset: (page - 1) * pageSize,
        orderBy: orderDefinition,
      });

    return {
      editorials,
      totalCount,
    };
  }

  recalculateExponentialDecayScore(
    editorial: Editorial,
    scoreDelta: number = 0,
  ) {
    const currentTime = dayjs();
    const currentScore = this.getCurrentExponentialDecayScore(
      editorial,
      currentTime,
    );
    editorial.denormalizedInfo.exponentialDecayScore.value =
      currentScore + scoreDelta;
    editorial.denormalizedInfo.exponentialDecayScore.valueUpdatedAt =
      currentTime.toDate();
  }

  async recalculateExponentialDecayScoreCache(problem: Problem) {
    const editorials = await this.editorialRepository.find({
      problem,
    });
    const currentTime = dayjs();
    editorials.forEach((editorial) => {
      editorial.denormalizedInfo.exponentialDecayScore.cachedValue =
        this.getCurrentExponentialDecayScore(editorial, currentTime);
    });
    problem.additionalInfo.exponentialDecayScoreCachedValueUpdatedAt =
      currentTime.toDate();
    await this.editorialRepository.getEntityManager().flush();
  }

  private getCurrentExponentialDecayScore(
    editorial: Editorial,
    currentTime?: Dayjs,
  ) {
    currentTime = currentTime || dayjs();
    const timeDiffInHours = currentTime.diff(
      dayjs(editorial.denormalizedInfo.exponentialDecayScore.valueUpdatedAt),
      'hour',
      true,
    );
    const latestScore = editorial.denormalizedInfo.exponentialDecayScore.value;
    const currentScore =
      latestScore * Math.exp(-this.coolingRate * timeDiffInHours);
    return currentScore;
  }

  async calculateWilsonScoreInterval(editorial: Editorial) {
    const totalVoteCount =
      editorial.denormalizedInfo.upvoteCount +
      editorial.denormalizedInfo.downvoteCount;

    editorial.denormalizedInfo.wilsonScoreInterval =
      this.getWilsionScoreInterval(
        editorial.denormalizedInfo.upvoteCount + 0.1, // give 0.1 upvote to avoid division by zero
        totalVoteCount + 0.1,
      );
  }

  /**
   * Wilson score interval
   * @param total total number of feedback
   * @param positive number of positive feedback
   * @param confidence confidence level (default: 0.95)
   * @returns Wilson score interval
   * @see https://www.evanmiller.org/how-not-to-sort-by-average-rating.html
   */
  private getWilsionScoreInterval(pos: number, n: number) {
    const z = 1.96; // hardcoded value (1-α/2) quantile of the standard normal distribution of 95% confidence level
    const phat = pos / n;
    const a = phat + (z * z) / (2 * n);
    const b = z * Math.sqrt((phat * (1 - phat) + (z * z) / (4 * n)) / n);
    const c = 1 + (z * z) / n;
    return {
      lowerBound: (a - b) / c,
      upperBound: (a + b) / c,
    };
  }
}
