import { EntityRepository } from '@mikro-orm/postgresql';
import { Tag } from '../entities/tag.entity';

export class TagRepository extends EntityRepository<Tag> {
  async findById(id: string): Promise<Tag | null> {
    return await this.findOne({ id });
  }
}
