/* eslint-disable @typescript-eslint/no-empty-object-type */
// reference: https://codeforces.com/apiHelp/objects

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
