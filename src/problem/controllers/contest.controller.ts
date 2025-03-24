import { Controller, Get, Param } from '@nestjs/common';
import { ContestApplication } from '../applications/contest.applicaiton';

@Controller('contest')
export class ContestController {
  constructor(private contestApplication: ContestApplication) {}

  @Get(':contestId')
  async getContestDetail(@Param('contestId') contestId: string) {
    return await this.contestApplication.getContestDetail(contestId);
  }
}
