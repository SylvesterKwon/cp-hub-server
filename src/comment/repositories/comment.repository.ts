import { EntityRepository } from '@mikro-orm/postgresql';
import { Comment } from '../entities/comment.entity';

export class CommentRepository extends EntityRepository<Comment> {}
