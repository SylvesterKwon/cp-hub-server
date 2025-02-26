import { MikroORM } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';
import { ProblemService } from '../services/problem.service';

@Injectable()
export class ProblemApplication {
  constructor(
    private orm: MikroORM,
    private problemService: ProblemService,
  ) {}

  async getProblemDetail(problemId: string) {
    // WIP
  }
}
