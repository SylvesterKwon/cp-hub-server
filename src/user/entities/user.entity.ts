import {
  Collection,
  Entity,
  ManyToMany,
  ManyToOne,
  OneToMany,
  Property,
  Ref,
  Unique,
} from '@mikro-orm/core';
import { UserRepository } from '../repositories/user.repositories';
import { TimestampedEntity } from 'src/common/entities/timestamped-entity.entity';
import { Editorial } from 'src/problem/entities/editorial.entity';
import { Role } from './role.entity';

@Entity({ repository: () => UserRepository })
export class User extends TimestampedEntity {
  @Property()
  @Unique()
  username: string;

  @Property()
  @Unique()
  email: string;

  @Property()
  profilePictureUrl?: string;

  @Property()
  hashedPassword: string;

  @ManyToOne(() => Role)
  role?: Ref<Role>;

  @OneToMany(() => Editorial, (editorial) => editorial.author)
  authoredEditorials = new Collection<Editorial>(this);

  @ManyToMany(() => Editorial, (editorial) => editorial.votedBy)
  votedEditorials = new Collection<Editorial>(this);
}
