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
  CommentNotFoundException,
  ParentCommentNotFoundException,
} from '../exceptions/comment.exception';
import { CommentService } from '../services/comment.service';
import { AuthService } from 'src/user/auth.service';
import { RoleType } from 'src/user/entities/role.entity';

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

    const { results, totalCount } = await this.commentService.getComments(dto);
    return {
      results: results,
      totalCount: totalCount,
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

    const comment = await this.commentService.addComment(
      user,
      {
        type: dto.context.type,
        id: dto.context.id,
      },
      dto.content,
      parentComment,
    );
    return { message: 'Comment added successfully', commentId: comment.id };
  }

  @Transactional()
  async editComment(user: User, commentId: string, dto: EditCommentDto) {
    const comment = await this.commentRepository.findOne({
      id: commentId,
    });
    if (!comment) throw new CommentNotFoundException();
    if (comment.author.id !== user.id) throw new UnauthorizedException();
    if (comment.isDeleted) throw new CommentNotFoundException();

    this.commentService.editComment(comment, dto.content);

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

    await this.commentService.deleteComment(comment);

    return { message: 'Comment deleted successfully', commentId: comment.id };
  }
}
