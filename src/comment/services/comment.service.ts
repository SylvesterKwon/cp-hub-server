import { Injectable, NotImplementedException } from '@nestjs/common';
import { CommentContextDto } from '../dtos/comment.dto';
import { CommentContextType } from '../entities/comment.entity';
import { MikroORM } from '@mikro-orm/core';
import { Problem } from 'src/problem/entities/problem.entity';
import { Editorial } from 'src/problem/entities/editorial.entity';
import { Contest } from 'src/problem/entities/contest.entity';

export const COMMENT_DEPTH_LIMIT = 10;

@Injectable()
export class CommentService {
  constructor(private orm: MikroORM) {}

  private getContextRepository(contextType: CommentContextType) {
    switch (contextType) {
      case CommentContextType.PROBLEM:
        return this.orm.em.getRepository(Problem);
      case CommentContextType.EDITORIAL:
        return this.orm.em.getRepository(Editorial);
      case CommentContextType.CONTEST:
        return this.orm.em.getRepository(Contest);
      default:
        throw new NotImplementedException(
          'Comment for given context is not implemented',
        );
    }
  }

  async getContext(commentContext: CommentContextDto) {
    return await this.getContextRepository(commentContext.type).findOne({
      id: commentContext.id,
    });
  }
}
