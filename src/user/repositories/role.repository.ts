import { EntityRepository } from '@mikro-orm/postgresql';
import { Role } from '../entities/role.entity';

export class RoleRepository extends EntityRepository<Role> {}
