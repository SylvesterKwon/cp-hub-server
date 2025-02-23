import { Injectable } from '@nestjs/common';
import { ContestType, DetailedContestType } from '../entities/contest.entity';

@Injectable()
export class CodeforcesService {
  constructor() {}

  getContestUrl(contestId: number) {
    return `https://codeforces.com/contest/${contestId}`;
  }

  getProblemUrl(contestId: number, problemIndex: string) {
    return `https://codeforces.com/contest/${contestId}/problem/${problemIndex}`;
  }

  classifyContestType(name: string): {
    contestType: ContestType;
    detailedContestType: DetailedContestType | null;
  } {
    const lowerCasedName = name.toLowerCase();
    if (lowerCasedName.includes('div. 1 + div. 2'))
      return {
        contestType: ContestType.CF,
        detailedContestType: DetailedContestType.CF_DIV1_DIV2,
      };
    else if (lowerCasedName.includes('educational'))
      return {
        contestType: ContestType.CF,
        detailedContestType: DetailedContestType.CF_EDU,
      };
    else if (lowerCasedName.includes('codeforces global round'))
      return {
        contestType: ContestType.CF,
        detailedContestType: DetailedContestType.CF_GLOBAL,
      };
    else if (lowerCasedName.includes('div. 1'))
      return {
        contestType: ContestType.CF,
        detailedContestType: DetailedContestType.CF_DIV1,
      };
    else if (
      lowerCasedName.includes('div. 2') ||
      lowerCasedName.includes('div 2') // just for contest id 12
    )
      return {
        contestType: ContestType.CF,
        detailedContestType: DetailedContestType.CF_DIV2,
      };
    else if (lowerCasedName.includes('div. 3'))
      return {
        contestType: ContestType.CF,
        detailedContestType: DetailedContestType.CF_DIV3,
      };
    else if (lowerCasedName.includes('div. 4'))
      return {
        contestType: ContestType.CF,
        detailedContestType: DetailedContestType.CF_DIV4,
      };
    else if (lowerCasedName.includes('kotlin heroes'))
      return {
        contestType: ContestType.CF,
        detailedContestType: DetailedContestType.CF_KOTLIN_HEROS,
      };
    else if (lowerCasedName.includes('q#'))
      return {
        contestType: ContestType.CF,
        detailedContestType: DetailedContestType.CF_Q_SHARP,
      };
    else if (lowerCasedName.includes('icpc'))
      return {
        contestType: ContestType.ICPC,
        detailedContestType: null,
      };
    else
      return {
        contestType: ContestType.CF,
        detailedContestType: null,
      };
  }
}
