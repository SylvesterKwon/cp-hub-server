import {
  Controller,
  Get,
  Param,
  ParseArrayPipe,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { ContestApplication } from '../applications/contest.applicaiton';
import { ContestType } from '../entities/contest.entity';

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
    // TODO: Add sort by
    // TODO: Add durationSeconds range, startedAt range, detailedType, problemCount filter
  ) {
    return await this.contestApplication.getContestList({
      page,
      pageSize,
      types,
      keyword,
    });
  }

  @Get(':contestId')
  async getContestDetail(@Param('contestId') contestId: string) {
    return await this.contestApplication.getContestDetail(contestId);
  }
}
