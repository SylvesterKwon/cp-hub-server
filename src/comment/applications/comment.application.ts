import { Injectable } from '@nestjs/common';
import { MikroORM, Transactional } from '@mikro-orm/core';
import { AddCommentDto } from '../dtos/comment.dto';
import { User } from 'src/user/entities/user.entity';
import { CommentRepository } from '../repositories/comment.repository';
import {
  CommentContextNotFoundException,
  CommentDepthExceedsLimitException,
  ParentCommentNotFoundException,
} from '../exceptions/comment.exception';
import {
  COMMENT_DEPTH_LIMIT,
  CommentService,
} from '../services/comment.service';

@Injectable()
export class CommentApplication {
  constructor(
    private orm: MikroORM,
    private commentService: CommentService,
    private commentRepository: CommentRepository,
  ) {}

  @Transactional()
  async addComment(user: User, dto: AddCommentDto) {
    let parentComment;
    if (dto.parentCommentId) {
      parentComment = await this.commentRepository.findOne({
        id: dto.parentCommentId,
      });
      if (!parentComment) throw new ParentCommentNotFoundException();
    }
    const context = await this.commentService.getContext(dto.context);
    if (!context) throw new CommentContextNotFoundException();
    const depth = parentComment ? parentComment.depth + 1 : 0;
    if (depth > COMMENT_DEPTH_LIMIT)
      throw new CommentDepthExceedsLimitException();

    const comment = this.commentRepository.create({
      author: user,
      context: dto.context,
      content: dto.content,
      parentComment: parentComment,
      depth,
    });
    return { message: 'Comment added successfully', commentId: comment.id };
  }
}
