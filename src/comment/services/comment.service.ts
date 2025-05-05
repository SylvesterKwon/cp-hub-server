import { Injectable, NotImplementedException } from '@nestjs/common';
import { CommentContextDto } from '../dtos/comment.dto';
import { CommentContextType } from '../entities/comment.entity';
import { MikroORM } from '@mikro-orm/core';
import { Problem } from 'src/problem/entities/problem.entity';
import { Editorial } from 'src/problem/entities/editorial.entity';
import { Contest } from 'src/problem/entities/contest.entity';
import { CommentRepository } from '../repositories/comment.repository';
import { CommentResponse } from '../types/comment-response.dto';
import { Comment } from '../entities/comment.entity';

export const COMMENT_DEPTH_LIMIT = 10;

@Injectable()
export class CommentService {
  constructor(
    private orm: MikroORM,
    private commentRepository: CommentRepository,
  ) {}

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

  async getComments(dto: CommentContextDto) {
    const comments = await this.commentRepository.find(
      { context: dto },
      { orderBy: { createdAt: 'desc' }, populate: ['author'] },
    );
    const totalCountExceptDeleted = await this.commentRepository.count({
      context: dto,
      isDeleted: false,
    });
    const ancestorComments = comments.filter((comment) => comment.depth === 0);

    const convertToCommentResponse = (comment: Comment): CommentResponse => {
      return {
        id: comment.id,
        isDeleted: comment.isDeleted,
        content: comment.content,
        createdAt: comment.createdAt,
        updatedAt: comment.updatedAt,
        author: comment.isDeleted
          ? undefined
          : {
              id: comment.author.id,
              username: comment.author.username,
              profilePictureUrl: comment.author.profilePictureUrl,
            },
        childComments: comments
          .filter((item) => item.parentComment?.id === comment.id)
          .map(convertToCommentResponse),
      };
    };

    const results = ancestorComments.map(convertToCommentResponse);
    return {
      results,
      totalCount: totalCountExceptDeleted,
    };
  }

  async deleteComment(comment: Comment) {
    const comments = await this.commentRepository.find({
      context: comment.context,
    });
    function getChildrenComments(c: Comment): Comment[] {
      return comments.filter((item) => item.parentComment === c);
    }
    if (getChildrenComments(comment).length > 0) {
      // if the comment has child comments, mark it as deleted
      comment.isDeleted = true;
      comment.content = undefined;
    } else {
      const commentsToRemove: Comment[] = [];
      while (getChildrenComments(comment).length <= 1) {
        commentsToRemove.push(comment);
        if (!comment.parentComment || comment.parentComment.isDeleted === false)
          break;
        comment = comment.parentComment;
      }
      this.commentRepository.getEntityManager().remove(commentsToRemove);
    }
  }
}
