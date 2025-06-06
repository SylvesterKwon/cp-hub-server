import {
  Controller,
  Post,
  Param,
  Body,
  Get,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { AuthenticationRequired } from 'src/common/decorators/auth.decorator';
import { Requester } from 'src/common/decorators/requester.decorator';
import { User } from 'src/user/entities/user.entity';
import { EditorialApplication } from '../applications/editorial.application';
import { EditorialVoteDto } from '../dtos/vote.dto';
import { EditorialListSortBy } from '../types/editorial.type';

@Controller('editorial')
export class EditorialController {
  constructor(private editorialApplication: EditorialApplication) {}

  @Get('')
  async getEditorialList(
    @Query('page', new ParseIntPipe({ optional: true })) page?: number,
    @Query('pageSize', new ParseIntPipe({ optional: true })) pageSize?: number,
    @Query('sortBy') sortBy?: EditorialListSortBy, // TODO: Add validation pipe (make it DTO with class-validator)
    @Requester() requester?: User,
  ) {
    return await this.editorialApplication.getEditorialList({
      page,
      pageSize,
      sortBy,
      requester,
    });
  }

  @Get(':editorialId')
  async getEditorial(@Param('editorialId') editorialId: string) {
    return await this.editorialApplication.getEditorial(editorialId);
  }

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
