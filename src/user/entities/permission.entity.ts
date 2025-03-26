import {
  Collection,
  Entity,
  ManyToMany,
  Property,
  Unique,
} from '@mikro-orm/core';
import { TimestampedEntity } from 'src/common/entities/timestamped-entity.entity';
import { PermissionRepository } from '../repositories/permission.repository';
import { Role } from './role.entity';

@Entity({ repository: () => PermissionRepository })
export class Permission extends TimestampedEntity {
  @Property()
  @Unique()
  name: string;

  @Property()
  description?: string;

  @ManyToMany(() => Role, (role) => role.permissions)
  roles = new Collection<Role>(this);
}
