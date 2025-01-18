import { Entity, Property, Unique } from '@mikro-orm/core';
import { UserRepository } from '../repositories/user.repositories';
import { TimestampedEntity } from 'src/common/entities/timestamped-entity.entity';

@Entity({ repository: () => UserRepository })
export class User extends TimestampedEntity {
  @Property()
  @Unique()
  username: string;

  @Property()
  @Unique()
  email: string;

  @Property()
  hashedPassword: string;

  // @ManyToOne({ entity: () => Role })
  // role?: Ref<Role>;
}
