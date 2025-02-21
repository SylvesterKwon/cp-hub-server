import { Injectable } from '@nestjs/common';

@Injectable()
export class CodeforcesService {
  constructor() {}

  getContestUrl(contestId: number) {
    return `https://codeforces.com/contest/${contestId}`;
  }

  getProblemUrl(contestId: number, problemIndex: string) {
    return `https://codeforces.com/contest/${contestId}/problem/${problemIndex}`;
  }
}
