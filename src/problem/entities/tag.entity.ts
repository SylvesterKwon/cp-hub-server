import { Collection, Entity, ManyToMany, Property } from '@mikro-orm/core';
import { TimestampedEntity } from 'src/common/entities/timestamped-entity.entity';
import { TagRepository } from '../repositories/tag.repository';
import { Problem } from './problem.entity';

@Entity({ repository: () => TagRepository })
export class Tag extends TimestampedEntity {
  @Property()
  name: string;

  @ManyToMany(() => Problem, (problem) => problem.tags)
  problems = new Collection<Problem>(this);
  // TODO: Add useful resources URL for this tag
}
