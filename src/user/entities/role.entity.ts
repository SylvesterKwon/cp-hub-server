import {
  Collection,
  Entity,
  ManyToMany,
  OneToMany,
  Property,
  Unique,
} from '@mikro-orm/core';
import { TimestampedEntity } from 'src/common/entities/timestamped-entity.entity';
import { Permission } from './permission.entity';
import { User } from './user.entity';
import { RoleRepository } from '../repositories/role.repository';

@Entity({ repository: () => RoleRepository })
export class Role extends TimestampedEntity {
  @Property()
  @Unique()
  name: string;

  @Property()
  description?: string;

  @ManyToMany()
  permissions = new Collection<Permission>(this);

  @OneToMany(() => User, (user) => user.role)
  users = new Collection<User>(this);
}

export enum RoleType {
  ADMIN = 'ADMIN',
}
