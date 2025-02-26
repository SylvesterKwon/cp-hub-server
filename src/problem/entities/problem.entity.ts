import { Collection, Entity, ManyToMany, Property } from '@mikro-orm/core';
import { TimestampedShortIdEntity } from 'src/common/entities/timestamped-entity.entity';
import { ProblemRepository } from '../repositories/problem.repository';
import { Tag } from './tag.entity';
import { Contest } from './contest.entity';

@Entity({ repository: () => ProblemRepository })
export class Problem extends TimestampedShortIdEntity {
  @Property()
  name: string;

  @ManyToMany()
  tags = new Collection<Tag>(this);

  @Property({ type: 'json' })
  availableOnlineJudges: { url: string }[] = [];

  @ManyToMany(() => Contest, (contest) => contest.problems)
  containingContests = new Collection<Contest>(this);
}
