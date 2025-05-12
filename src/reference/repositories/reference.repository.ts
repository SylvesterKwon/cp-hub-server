import { EntityRepository } from '@mikro-orm/postgresql';
import { Reference } from '../entities/reference.entity';

export class ReferenceRepository extends EntityRepository<Reference> {}
