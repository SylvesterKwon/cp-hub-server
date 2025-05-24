import { Controller, Post, Param, Body, Get } from '@nestjs/common';
import { AuthenticationRequired } from 'src/common/decorators/auth.decorator';
import { Requester } from 'src/common/decorators/requester.decorator';
import { User } from 'src/user/entities/user.entity';
import { EditorialApplication } from '../applications/editorial.application';
import { EditorialVoteDto } from '../dtos/vote.dto';

@Controller('editorial')
export class EditorialController {
  constructor(private editorialApplication: EditorialApplication) {}

  @AuthenticationRequired()
  @Post(':editorialId/vote')
  async vote(
    @Param('editorialId') editorialId: string,
    @Requester() user: User,
    @Body() dto: EditorialVoteDto,
  ) {
    return await this.editorialApplication.voteEditorial(
      editorialId,
      user,
      dto.action,
    );
  }

  @Get(':editorialId/citations')
  async getCitations(@Param('editorialId') editorialId: string) {
    return await this.editorialApplication.getCitations(editorialId);
  }
}
