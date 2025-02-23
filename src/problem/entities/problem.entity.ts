import {
  Collection,
  Entity,
  Enum,
  ManyToMany,
  Property,
} from '@mikro-orm/core';
import { TimestampedEntity } from 'src/common/entities/timestamped-entity.entity';
import { ProblemRepository } from '../repositories/problem.repository';
import { Tag } from './tag.entity';
import { Contest } from './contest.entity';

@Entity({ repository: () => ProblemRepository })
export class Problem extends TimestampedEntity {
  @Property()
  name: string;

  @Enum(() => ProblemSource)
  source: ProblemSource;

  @ManyToMany()
  tags = new Collection<Tag>(this);

  @Property({ type: 'json' })
  availableOnlineJudges: { url: string }[] = [];

  @ManyToMany(() => Contest, (contest) => contest.problems)
  containingContests = new Collection<Contest>(this);
}

export enum ProblemSource {
  CF = 'CF',
  IOI = 'IOI',
  ICPC = 'ICPC',
  BOJ = 'BOJ',
  USACO = 'USACO',
  ATCODER = 'ATCODER',
}
