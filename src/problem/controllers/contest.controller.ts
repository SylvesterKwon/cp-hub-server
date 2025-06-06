import {
  Controller,
  Get,
  Param,
  ParseArrayPipe,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { ContestApplication } from '../applications/contest.application';
import { ContestType } from '../entities/contest.entity';
import { ContestListSortBy } from '../types/contest.type';

@Controller('contest')
export class ContestController {
  constructor(private contestApplication: ContestApplication) {}

  @Get('')
  async getContestList(
    @Query('page', new ParseIntPipe({ optional: true })) page?: number,
    @Query('pageSize', new ParseIntPipe({ optional: true })) pageSize?: number,
    @Query(
      'types',
      new ParseArrayPipe({ items: String, separator: ',', optional: true }),
    )
    types?: ContestType[],
    @Query(
      'keyword',
      new ParseArrayPipe({ items: String, separator: ',', optional: true }),
    )
    keyword?: string,
    @Query('sortBy') sortBy?: ContestListSortBy, // TODO: Add validation pipe (make it DTO with class-validator)
    // TODO: Add durationSeconds range, startedAt range, detailedType, problemCount filter
  ) {
    return await this.contestApplication.getContestList({
      page,
      pageSize,
      types,
      keyword,
      sortBy,
    });
  }

  @Get(':contestId')
  async getContestDetail(@Param('contestId') contestId: string) {
    return await this.contestApplication.getContestDetail(contestId);
  }
}
