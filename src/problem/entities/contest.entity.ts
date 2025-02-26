import {
  BigIntType,
  Collection,
  Entity,
  Enum,
  ManyToMany,
  Property,
} from '@mikro-orm/core';
import { TimestampedShortIdEntity } from 'src/common/entities/timestamped-entity.entity';
import { ContestRepository } from '../repositories/contest.repository';
import { Problem } from './problem.entity';
import { ContestProblems } from './contest-problems.entity';

@Entity({ repository: () => ContestRepository })
export class Contest extends TimestampedShortIdEntity {
  @Property()
  name: string;

  /** Type of contest */
  @Enum(() => ContestType)
  type: ContestType;

  /** Type of contest */
  @Enum(() => DetailedContestType)
  detailedType?: DetailedContestType;

  /** Contest Id for each platform. Use it with contest type (e.g. ATCODER ABC393, CF 1249) */
  @Property()
  platformContestId?: string;

  @Property()
  startedAt?: Date;

  @Property({ type: new BigIntType('number') })
  durationSeconds?: number;

  @ManyToMany({ pivotEntity: () => ContestProblems })
  problems = new Collection<Problem>(this);
}

export enum ContestType {
  CF = 'CF',
  IOI = 'IOI',
  KOI = 'KOI',
  JOI = 'JOI',
  ICPC = 'ICPC',
  BOJ = 'BOJ',
  USACO = 'USACO',
  ATCODER = 'ATCODER',
  // TOPCODER
  UNKNOWN = 'UNKNOWN',
}

export enum DetailedContestType {
  // CF
  CF_DIV1 = 'CF_DIV1',
  CF_DIV2 = 'CF_DIV2',
  CF_DIV3 = 'CF_DIV3',
  CF_DIV4 = 'CF_DIV4',
  CF_DIV1_DIV2 = 'CF_DIV1_DIV2',
  CF_EDU = 'CF_EDU',
  CF_GLOBAL = 'CF_GLOBAL',
  CF_KOTLIN_HEROS = 'CF_KOTLIN_HEROS',
  CF_Q_SHARP = 'CF_Q_SHARP',
  CF_ETC = 'CF_ETC',

  // ATCODER
  ATCODER_ABC = 'ATCODER_ABC',
  ATCODER_ARC = 'ATCODER_ARC',
  ATCODER_AGC = 'ATCODER_AGC',
  // ATCODER_ABC_LIKE = 'ATCODER_ABC_LIKE',
  // ATCODER_ARC_LIKE = 'ATCODER_ARC_LIKE',
  // ATCODER_AGC_LIKE = 'ATCODER_AGC_LIKE',
  ATCODER_ETC = 'ATCODER_ETC',

  // ...
}

export const checkContestHasStartedAt = (
  contest: Contest,
): contest is Contest & { startedAt: Date } => {
  return contest.startedAt instanceof Date;
};
