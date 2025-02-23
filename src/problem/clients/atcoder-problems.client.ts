import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { catchError, firstValueFrom } from 'rxjs';

/**
 * Client for Atcoder-problems API (Unofficial AtCoder API).
 * [Reference](https://github.com/kenkoooo/AtCoderProblems/blob/master/doc/api.md)
 *
 * Thank you kenkoooo for providing the API!
 */
@Injectable()
export class AtcoderProblemsClient {
  private baseUrl = 'https://kenkoooo.com/atcoder/resources';
  constructor(private httpService: HttpService) {}

  private async get<T>(resourceName: string): Promise<T> {
    const res = await firstValueFrom(
      this.httpService.get<T>(`${this.baseUrl}/${resourceName}`).pipe(
        catchError((err) => {
          throw new Error(err);
        }),
      ),
    );
    return res.data;
  }

  async getContestsInformation() {
    return await this.get<AtCoderProblemsContestInformation[]>('contests.json');
  }

  async getProblemsInformation() {
    return await this.get<AtCoderProblemsProblemInformation[]>('problems.json');
  }

  async getDetailedProblemInformation() {
    return await this.get<AtCoderProblemsDetailedProblemInformation[]>(
      'merged-problems.json',
    );
  }

  async getPairsOfContestsAndProblems() {
    return await this.get<AtCoderProblemsContestProblemPairInformation[]>(
      'contest-problem.json',
    );
  }
}

// TYPE DEFINITIONS
export type AtCoderProblemsContestInformation = {
  id: string;
  start_epoch_second: number;
  duration_second: number;
  title: string;
  rate_change: string;
};

export type AtCoderProblemsProblemInformation = {
  id: string;
  contest_id: string;
  problem_index: string;
  name: string;
  title: string;
};

export type AtCoderProblemsDetailedProblemInformation = {
  id: string;
  contest_id: string;
  problem_index: string;
  name: string;
  title: string;
  shortest_submission_id: number | null;
  shortest_contest_id: string | null;
  shortest_user_id: string | null;
  fastest_submission_id: number | null;
  fastest_contest_id: string | null;
  fastest_user_id: string | null;
  first_submission_id: number | null;
  first_contest_id: string | null;
  first_user_id: string | null;
  source_code_length: number | null;
  execution_time: number | null;
  point: number | null;
  solver_count: number | null;
};

export type AtCoderProblemsContestProblemPairInformation = {
  contest_id: string;
  problem_id: string;
  problem_index: string;
};
