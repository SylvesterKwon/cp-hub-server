import { Controller, Get, Param } from '@nestjs/common';
import { ProblemApplication } from '../applications/problem.applicaiton';

@Controller('problem')
export class ProblemController {
  constructor(private problemApplication: ProblemApplication) {}

  @Get(':problemId')
  async getProblemDetail(@Param('problemId') problemId: string) {
    return await this.problemApplication.getProblemDetail(problemId);
  }
}
