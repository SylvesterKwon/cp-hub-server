import { EntityRepository } from '@mikro-orm/postgresql';
import { Editorial } from '../entities/editorial.entity';

export class EditorialRepository extends EntityRepository<Editorial> {}
