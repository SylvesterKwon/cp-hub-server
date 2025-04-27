import { Body, Controller, Post } from '@nestjs/common';
import { CommentApplication } from '../applications/comment.application';
import { AuthenticationRequired } from 'src/common/decorators/auth.decorator';
import { Requester } from 'src/common/decorators/requester.decorator';
import { User } from 'src/user/entities/user.entity';
import { AddCommentDto } from '../dtos/comment.dto';

@Controller('comment')
export class CommentController {
  constructor(private readonly commentApplication: CommentApplication) {}

  // TODO: Get comment

  // TODO: Add comment
  @AuthenticationRequired()
  @Post('add')
  async addComment(@Requester() user: User, @Body() dto: AddCommentDto) {
    return await this.commentApplication.addComment(user, dto);
  }

  // TODO: Edit comment

  // TODO: Delete comment
}
