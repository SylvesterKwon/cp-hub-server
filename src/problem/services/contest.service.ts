import { Injectable } from '@nestjs/common';
import { Contest, ContestType } from '../entities/contest.entity';

@Injectable()
export class ContestService {
  constructor() {}

  getContestUrl(contest: Contest): string | undefined {
    if (contest.type === ContestType.CF)
      return `https://codeforces.com/contest/${contest.platformContestId}`;
    else if (contest.type === ContestType.ATCODER)
      return `https://atcoder.jp/contests/${contest.platformContestId}`;
    else if (contest.type === ContestType.BOJ)
      return `https://www.acmicpc.net/category/detail/${contest.platformContestId}`;
    // Add more contest URL by contest URL here
    else return undefined;
  }
}
