import { Entity, Enum, ManyToOne } from '@mikro-orm/core';
import { Editorial } from './editorial.entity';
import { User } from 'src/user/entities/user.entity';
import { EditorialVotesRepository } from '../repositories/editorial-votes.repository';
import { TimestampedEntity } from 'src/common/entities/timestamped-entity.entity';

@Entity({ repository: () => EditorialVotesRepository })
export class EditorialVotes extends TimestampedEntity {
  @ManyToOne({ primary: true })
  editorial: Editorial;

  @ManyToOne({ primary: true })
  user: User;

  @Enum(() => EditorialVoteType)
  type: EditorialVoteType;
}

export enum EditorialVoteType {
  UPVOTE = 'upvote',
  DOWNVOTE = 'downvote',
}
