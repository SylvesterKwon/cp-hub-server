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
import { CommentDenormalizedInfo } from 'src/comment/types/comment.type';

const intialExponentialDecayScore = 100;

export type EditorialDenormalizedInfo = {
  upvoteCount: number;
  downvoteCount: number;
  wilsonScoreInterval: {
    lowerBound: number;
    upperBound: number;
  };
  exponentialDecayScore: {
    value: number;
    valueUpdatedAt: Date | null;
    cachedValue: number;
  };
} & CommentDenormalizedInfo;

@Index({
  expression: `
  CREATE INDEX denormalized_info_wilson_score_interval_lower_bound_float ON editorial (((denormalized_info->'wilsonScoreInterval'->'lowerBound')::float));
  `,
  // Currently not using index below (consider this when many editorials are registered in one problem)
  // CREATE INDEX denormalized_info_exponential_decay_score_cached_value_float ON editorial (((denormalized_info->'exponentialDecayScore'->'cachedValue')::float));
})
@Entity({ repository: () => EditorialRepository })
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
  })
  denormalizedInfo: Opt<EditorialDenormalizedInfo> = {
    upvoteCount: 0,
    downvoteCount: 0,
    wilsonScoreInterval: {
      lowerBound: 0,
      upperBound: 0,
    }, // TODO: calculate when vote is {0,0}
    exponentialDecayScore: {
      value: intialExponentialDecayScore,
      valueUpdatedAt: new Date(),
      cachedValue: intialExponentialDecayScore,
    },
    commentCount: 0,
  };
}
