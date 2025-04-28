import { Body, Controller, Param, Post } from '@nestjs/common';
import { CommentApplication } from '../applications/comment.application';
import { AuthenticationRequired } from 'src/common/decorators/auth.decorator';
import { Requester } from 'src/common/decorators/requester.decorator';
import { User } from 'src/user/entities/user.entity';
import { AddCommentDto, EditCommentDto } from '../dtos/comment.dto';

@Controller('comment')
export class CommentController {
  constructor(private readonly commentApplication: CommentApplication) {}

  // TODO: Get comment

  @AuthenticationRequired()
  @Post('add')
  async addComment(@Requester() user: User, @Body() dto: AddCommentDto) {
    return await this.commentApplication.addComment(user, dto);
  }

  @AuthenticationRequired()
  @Post(':commentId/edit')
  async editComment(
    @Requester() user: User,
    @Param('commentId') commentId: string,
    @Body() dto: EditCommentDto,
  ) {
    return await this.commentApplication.editComment(user, commentId, dto);
  }

  @AuthenticationRequired()
  @Post(':commentId/delete')
  async deleteComment(
    @Requester() user: User,
    @Param('commentId') commentId: string,
  ) {
    return await this.commentApplication.deleteComment(user, commentId);
  }
}
