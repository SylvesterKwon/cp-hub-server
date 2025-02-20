import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import {
  CodeforcesBaseResponse,
  CodeforcesContestResponse,
} from './codeforces-client.types';

/**
 * Client for Codeforces API.
 * [Reference](https://codeforces.com/apiHelp)
 */
@Injectable()
export class CodeforcesClient {
  private baseUrl = 'https://codeforces.com/api';
  constructor(private httpService: HttpService) {}

  private async get<T>(
    methodName: string,
    params?: Record<string, any>,
  ): Promise<CodeforcesBaseResponse<T>> {
    // TODO: Add authorization if needed
    const res = await firstValueFrom(
      this.httpService.get<CodeforcesBaseResponse<T>>(
        `${this.baseUrl}/${methodName}`,
        {
          params: { lang: 'en', ...params },
        },
      ),
    );
    return res.data;
  }

  // blogEntry.comments
  // blogEntry.view
  // contest.hacks
  // contest.list
  async getContestList(params: { gym?: boolean; groupCode?: string }) {
    const res = await this.get<CodeforcesContestResponse[]>(
      'contest.list',
      params,
    );
    console.log(res);
    return res;
  }
  // contest.ratingChanges
  // contest.standings
  async getContestStandings() {
    // WIP
  }
  // contest.status
  // problemset.problems
  // problemset.recentStatus
  // recentActions
  // user.blogEntries
  // user.friends
  // user.info
  // user.ratedList
  // user.rating
  // user.status
}
