import { Injectable, UnauthorizedException } from '@nestjs/common';
import { MikroORM, Transactional } from '@mikro-orm/core';
import {
  AddCommentDto,
  CommentContextDto,
  EditCommentDto,
} from '../dtos/comment.dto';
import { User } from 'src/user/entities/user.entity';
import { CommentRepository } from '../repositories/comment.repository';
import {
  CommentContextNotFoundException,
  CommentDepthExceedsLimitException,
  CommentNotFoundException,
  ParentCommentNotFoundException,
} from '../exceptions/comment.exception';
import {
  COMMENT_DEPTH_LIMIT,
  CommentService,
} from '../services/comment.service';
import { AuthService } from 'src/user/auth.service';
import { RoleType } from 'src/user/entities/role.entity';
import { Comment } from '../entities/comment.entity';
import { CommentResponse } from '../types/comment-response.dto';

@Injectable()
export class CommentApplication {
  constructor(
    private orm: MikroORM,
    private commentService: CommentService,
    private commentRepository: CommentRepository,
    private authService: AuthService,
  ) {}

  async getComments(dto: CommentContextDto) {
    // TODO: Add pagination
    const context = await this.commentService.getContext(dto);
    if (!context) throw new CommentContextNotFoundException();

    const comments = await this.commentRepository.find(
      { context: dto },
      { orderBy: { createdAt: 'desc' }, populate: ['author'] },
    );

    const ancestorComments = comments.filter((comment) => comment.depth === 0);

    const convertToCommentResponse = (comment: Comment): CommentResponse => {
      return {
        isDeleted: comment.isDeleted,
        content: comment.content,
        createdAt: comment.createdAt,
        updatedAt: comment.updatedAt,
        author: comment.isDeleted
          ? undefined
          : {
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
      results: results,
    };
  }

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

  @Transactional()
  async editComment(user: User, commentId: string, dto: EditCommentDto) {
    const comment = await this.commentRepository.findOne({
      id: commentId,
    });
    if (!comment) throw new CommentNotFoundException();
    if (comment.author.id !== user.id) throw new UnauthorizedException();

    comment.content = dto.content;
    return { message: 'Comment edited successfully', commentId: comment.id };
  }

  @Transactional()
  async deleteComment(user: User, commentId: string) {
    const isAdmin = await this.authService.checkIfUserInRole(
      user,
      RoleType.ADMIN,
    );
    const comment = await this.commentRepository.findOne({
      id: commentId,
    });
    if (!comment) throw new CommentNotFoundException();
    if (!isAdmin && comment.author.id !== user.id)
      throw new UnauthorizedException();

    comment.isDeleted = true;
    comment.content = undefined;

    return { message: 'Comment deleted successfully', commentId: comment.id };
  }
}
