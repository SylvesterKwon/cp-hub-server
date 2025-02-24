import { Injectable } from '@nestjs/common';
import { ContestType, DetailedContestType } from '../entities/contest.entity';
import { AtCoderProblemsContestInformation } from '../clients/atcoder-problems.client';

@Injectable()
export class AtCoderService {
  constructor() {}
  getProblemUrl(contestId: string, problemIndex: string) {
    return `https://atcoder.jp/contests/${contestId}/tasks/${problemIndex}`;
  }
  /**
   * AtCoder Contest Type Classifier
   *
   * [Reference](https://github.com/kenkoooo/AtCoderProblems/blob/master/atcoder-problems-frontend/src/utils/ContestClassifier.ts)
   */
  classifyContestType(contestInfo: AtCoderProblemsContestInformation): {
    contestType: ContestType;
    detailedContestType: DetailedContestType | null;
  } {
    if (/^abc\d{3}$/.exec(contestInfo.id))
      return {
        contestType: ContestType.ATCODER,
        detailedContestType: DetailedContestType.ATCODER_ABC,
      };
    else if (/^arc\d{3}$/.exec(contestInfo.id))
      return {
        contestType: ContestType.ATCODER,
        detailedContestType: DetailedContestType.ATCODER_ARC,
      };
    else if (/^agc\d{3}$/.exec(contestInfo.id))
      return {
        contestType: ContestType.ATCODER,
        detailedContestType: DetailedContestType.ATCODER_AGC,
      };
    else if (/^agc\d{3}$/.exec(contestInfo.id))
      return {
        contestType: ContestType.JOI,
        detailedContestType: null,
      };
    else {
      return {
        contestType: ContestType.ATCODER,
        detailedContestType: DetailedContestType.ATCODER_ETC,
      };
    }
  }
}
