import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { catchError, firstValueFrom } from 'rxjs';

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
      this.httpService
        .get<CodeforcesBaseResponse<T>>(`${this.baseUrl}/${methodName}`, {
          params: { lang: 'en', ...params },
        })
        .pipe(
          catchError((err) => {
            throw new Error(err.response?.data?.comment);
          }),
        ),
    );
    if (res.data.status === 'FAILED')
      // TODO: make it codeforces client error
      throw new Error(res.data.comment);
    return res.data;
  }

  // blogEntry.comments
  // blogEntry.view
  // contest.hacks
  // contest.list
  async getContestList(params?: { gym?: boolean; groupCode?: string }) {
    return await this.get<CodeforcesContestResponse[]>('contest.list', params);
  }
  // contest.ratingChanges
  // contest.standings
  async getContestStandings(params: {
    contestId: number;
    asManager?: boolean;
    from?: number;
    count?: number;
    handles?: string;
    room?: number;
    showUnofficial?: boolean;
    participantTypes?:
      | 'CONTESTANT'
      | 'PRACTICE'
      | 'VIRTUAL'
      | 'MANAGER'
      | 'OUT_OF_COMPETITION';
  }) {
    return await this.get<{
      contest: CodeforcesContestResponse;
      problems: CodeforcesProblemResponse[];
      rows: CodeforcesRanklistRowResponse[];
    }>('contest.standings', params);
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

// TYPE DEFINITIONS (reference: https://codeforces.com/apiHelp/objects)
/* eslint-disable @typescript-eslint/no-empty-object-type */
export type CodeforcesBaseResponse<T> = {
  status: 'OK' | 'FAILED';
  result: T;
  comment?: string;
};
export type CodeforcesUserResponse = {};
export type CodeforcesBlogEntryResponse = {};
export type CodeforcesCommentResponse = {};
export type CodeforcesRecentActionResponse = {};
export type CodeforcesRatingChangeResponse = {};
export type CodeforcesContestResponse = {
  id: number;
  name: string;
  type: 'CF' | 'IOI' | 'ICPC';
  phase:
    | 'BEFORE'
    | 'CODING'
    | 'PENDING_SYSTEM_TEST'
    | 'SYSTEM_TEST'
    | 'FINISHED';
  frozen: boolean;
  durationSeconds: number;
  freezeDurationSeconds?: number;
  startTimeSeconds?: number;
  relativeTimeSeconds?: number;
  preparedBy?: string;
  websiteUrl?: string;
  description?: string;
  difficulty?: number;
  kind?: string;
  icpcRegion?: string;
  country?: string;
  city?: string;
  season?: string;
};
export type CodeforcesPartyResponse = {};
export type CodeforcesMemberResponse = {};
export type CodeforcesProblemResponse = {
  contestId?: number;
  problemsetName?: string;
  index: string;
  name: string;
  type: 'PROGRAMMING' | 'QUESTION';
  points?: number;
  rating?: number;
  tags: string[];
};
export type CodeforcesProblemStatisticsResponse = {
  contestId?: number;
  index: string;
  solvedCount: number;
};
export type CodeforcesSubmissionResponse = {};
export type CodeforcesHackResponse = {};
export type CodeforcesRanklistRowResponse = {};
export type CodeforcesProblemResultResponse = {};
