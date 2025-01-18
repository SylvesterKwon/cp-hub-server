import { EntityRepository } from '@mikro-orm/postgresql';
import { User } from '../entities/user.entity';

export class UserRepository extends EntityRepository<User> {
  async findById(userId: string): Promise<User | null> {
    return await this.findOne({ id: userId });
  }

  async findByUsername(username: string): Promise<User | null> {
    return await this.findOne({ username: username });
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.findOne({ email: email });
  }
}
