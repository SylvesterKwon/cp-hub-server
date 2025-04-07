import {
  Collection,
  Entity,
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
  hashedPassword: string;

  @ManyToOne(() => Role)
  role?: Ref<Role>;

  @OneToMany(() => Editorial, (editorial) => editorial.author)
  editorials = new Collection<Editorial>(this);
}
