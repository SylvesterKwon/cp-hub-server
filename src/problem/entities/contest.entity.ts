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
}

export const checkContestHasStartedAt = (
  contest: Contest,
): contest is Contest & { startedAt: Date } => {
  return contest.startedAt instanceof Date;
};
