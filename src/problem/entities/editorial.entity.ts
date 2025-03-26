import { Entity, ManyToOne, Property } from '@mikro-orm/core';
import { TimestampedEntity } from 'src/common/entities/timestamped-entity.entity';
import { Problem } from './problem.entity';
import { User } from 'src/user/entities/user.entity';
import { EditorialRepository } from '../repositories/editorial.repository';

@Entity({ repository: () => EditorialRepository })
export class Editorial extends TimestampedEntity {
  @ManyToOne()
  problem: Problem;

  @ManyToOne()
  author: User;

  @Property({ columnType: 'text' })
  content: string;
}
