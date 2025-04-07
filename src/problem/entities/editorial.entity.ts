import {
  Collection,
  Entity,
  Index,
  JsonType,
  ManyToMany,
  ManyToOne,
  Opt,
  Property,
} from '@mikro-orm/core';
import { TimestampedEntity } from 'src/common/entities/timestamped-entity.entity';
import { Problem } from './problem.entity';
import { User } from 'src/user/entities/user.entity';
import { EditorialRepository } from '../repositories/editorial.repository';
import { EditorialVotes } from './editorial-votes.entity';

export type EditorialDenormalizedInfo = {
  upvoteCount: number;
  downvoteCount: number;
  wilsonScoreInterval: {
    lowerBound: number;
    upperBound: number;
  };
  exponentialDecayScore: number;
  exponentialDecayScoreUpdatedAt: Date | null;
};

const defaultDenormalizedInfo: EditorialDenormalizedInfo = {
  upvoteCount: 0,
  downvoteCount: 0,
  wilsonScoreInterval: {
    lowerBound: 0,
    upperBound: 0,
  }, // TODO: calculate when vote is {0,0}
  exponentialDecayScore: 0,
  exponentialDecayScoreUpdatedAt: null,
};

@Entity({ repository: () => EditorialRepository })
@Index({ properties: 'denormalizedInfo.wilsonScoreInterval.lowerBound' })
@Index({ properties: 'denormalizedInfo.exponentialDecayScore' })
export class Editorial extends TimestampedEntity {
  @ManyToOne()
  problem: Problem;

  @ManyToOne()
  author: User;

  @Property({ columnType: 'text' })
  content: string;

  @ManyToMany({ pivotEntity: () => EditorialVotes })
  votedBy = new Collection<User>(this);

  @Property({
    type: JsonType,
    default: JSON.stringify(defaultDenormalizedInfo),
  })
  denormalizedInfo: EditorialDenormalizedInfo & Opt;
}
