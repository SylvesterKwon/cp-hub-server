import { EntityRepository, RequiredEntityData } from '@mikro-orm/postgresql';
import { Contest, ContestType } from '../entities/contest.entity';

export class ContestRepository extends EntityRepository<Contest> {
  async findById(id: string): Promise<Contest | null> {
    return await this.findOne({ id });
  }

  async findByTypeAndName(
    type: ContestType,
    name: string,
  ): Promise<Contest | null> {
    return await this.findOne({ type, name });
  }

  async upsertByTypeAndName(
    data: RequiredEntityData<Contest>,
  ): Promise<Contest> {
    const existingContest = await this.findOne({
      type: data.type,
      name: data.name,
    });
    if (existingContest) return this.assign(existingContest, data);
    else return this.create(data);
  }
}
