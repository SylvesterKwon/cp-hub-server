import {
  Collection,
  Entity,
  Index,
  JsonType,
  ManyToOne,
  OneToMany,
  Opt,
  Property,
} from '@mikro-orm/core';
import { TimestampedEntity } from 'src/common/entities/timestamped-entity.entity';
import { CommentRepository } from '../repositories/comment.repository';
import { User } from 'src/user/entities/user.entity';

export enum CommentContextType {
  PROBLEM = 'problem',
  EDITORIAL = 'editorial',
  CONTEST = 'contest',
}

export type CommentContext = {
  type: CommentContextType;
  id: string;
};

@Index({ properties: ['context.type', 'context.id'] })
@Entity({ repository: () => CommentRepository })
export class Comment extends TimestampedEntity {
  @Property({
    type: JsonType,
  })
  context: CommentContext;

  @Property()
  isDeleted: Opt<boolean> = false;

  @ManyToOne()
  author: User;

  @ManyToOne()
  parentComment?: Comment;

  @OneToMany(() => Comment, (comment) => comment.parentComment)
  childComments: Collection<Comment> = new Collection<Comment>(this);

  @Property()
  depth: number;

  @Property({ columnType: 'text' })
  content?: string;
}
