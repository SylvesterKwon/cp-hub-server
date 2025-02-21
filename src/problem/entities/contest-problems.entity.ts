import { Entity, ManyToOne, Property } from '@mikro-orm/core';
import { Contest } from './contest.entity';
import { Problem } from './problem.entity';
import { ContestProblemsRepository } from '../repositories/contest-problems.repository';

// custom join table: https://mikro-orm.io/docs/6.0/composite-keys#use-case-3-join-table-with-metadata
@Entity({ repository: () => ContestProblemsRepository })
export class ContestProblems {
  @ManyToOne({ primary: true })
  contest: Contest;

  @ManyToOne({ primary: true })
  problem: Problem;

  @Property()
  index?: string;
}
