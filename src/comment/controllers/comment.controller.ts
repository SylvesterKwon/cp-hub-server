import { Body, Controller, Param, Post } from '@nestjs/common';
import { CommentApplication } from '../applications/comment.application';
import { AuthenticationRequired } from 'src/common/decorators/auth.decorator';
import { Requester } from 'src/common/decorators/requester.decorator';
import { User } from 'src/user/entities/user.entity';
import { AddCommentDto } from '../dtos/comment.dto';

@Controller('comment')
export class CommentController {
  constructor(private readonly commentApplication: CommentApplication) {}

  // TODO: Get comment

  @AuthenticationRequired()
  @Post('add')
  async addComment(@Requester() user: User, @Body() dto: AddCommentDto) {
    return await this.commentApplication.addComment(user, dto);
  }

  // TODO: Edit comment

  @AuthenticationRequired()
  @Post('delete/:commentId')
  async deleteComment(
    @Requester() user: User,
    @Param('commentId') commentId: string,
  ) {
    return await this.commentApplication.deleteComment(user, commentId);
  }
}
