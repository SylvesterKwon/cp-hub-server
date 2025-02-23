import {
  Collection,
  Entity,
  Enum,
  ManyToMany,
  Property,
} from '@mikro-orm/core';
import { TimestampedEntity } from 'src/common/entities/timestamped-entity.entity';
import { ContestRepository } from '../repositories/contest.repository';
import { Problem } from './problem.entity';
import { ContestProblems } from './contest-problems.entity';

@Entity({ repository: () => ContestRepository })
export class Contest extends TimestampedEntity {
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

  @Property()
  durationSeconds?: number;

  @ManyToMany({ pivotEntity: () => ContestProblems })
  problems = new Collection<Problem>(this);
}

export enum ContestType {
  CF = 'CF',
  IOI = 'IOI',
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
  // ...
}

export const checkContestHasStartedAt = (
  contest: Contest,
): contest is Contest & { startedAt: Date } => {
  return contest.startedAt instanceof Date;
};
