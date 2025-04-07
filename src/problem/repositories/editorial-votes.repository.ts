import { EntityRepository } from '@mikro-orm/postgresql';
import { EditorialVotes } from '../entities/editorial-votes.entity';

export class EditorialVotesRepository extends EntityRepository<EditorialVotes> {}
