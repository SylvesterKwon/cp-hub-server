import { EntityRepository } from '@mikro-orm/postgresql';
import { Permission } from '../entities/permission.entity';

export class PermissionRepository extends EntityRepository<Permission> {
  async findByName(name: string) {
    return this.findOne({ name });
  }
}
