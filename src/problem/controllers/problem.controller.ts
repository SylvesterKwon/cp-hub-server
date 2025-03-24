import {
  Controller,
  Get,
  Param,
  ParseArrayPipe,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { ProblemApplication } from '../applications/problem.applicaiton';

@Controller('problem')
export class ProblemController {
  constructor(private problemApplication: ProblemApplication) {}

  @Get('')
  async getProblemList(
    @Query('page', new ParseIntPipe({ optional: true })) page?: number,
    @Query('pageSize', new ParseIntPipe({ optional: true })) pageSize?: number,
    @Query(
      'contestTypes',
      new ParseArrayPipe({ items: String, separator: ',', optional: true }),
    )
    contestTypes?: string[],
    @Query(
      'keyword',
      new ParseArrayPipe({ items: String, separator: ',', optional: true }),
    )
    keyword?: string,
    // TODO: Add sort by
  ) {
    return await this.problemApplication.getProblemList({
      page,
      pageSize,
      contestTypes,
      keyword,
    });
  }

  @Get(':problemId')
  async getProblemDetail(@Param('problemId') problemId: string) {
    return await this.problemApplication.getProblemDetail(problemId);
  }
}
