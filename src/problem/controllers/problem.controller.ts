import {
  Body,
  Controller,
  Get,
  Param,
  ParseArrayPipe,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { ProblemApplication } from '../applications/problem.applicaiton';
import { EditorialApplication } from '../applications/editorial.application';
import { AuthenticationRequired } from 'src/common/decorators/auth.decorator';
import { Requester } from 'src/common/decorators/requester.decorator';
import { UpdateEditorialDto } from '../dtos/editorial.dto';
import { User } from 'src/user/entities/user.entity';
import { EditorialListSortBy } from '../types/editorial.type';

@Controller('problem')
export class ProblemController {
  constructor(
    private problemApplication: ProblemApplication,
    private editorialApplication: EditorialApplication,
  ) {}

  @Get('')
  async getProblemList(
    @Query('page', new ParseIntPipe({ optional: true })) page?: number,
    @Query('pageSize', new ParseIntPipe({ optional: true })) pageSize?: number,
    @Query(
      'contestTypes',
      new ParseArrayPipe({ items: String, separator: ',', optional: true }),
    )
    contestTypes?: string[],
    @Query(
      'keyword',
      new ParseArrayPipe({ items: String, separator: ',', optional: true }),
    )
    keyword?: string,
    // TODO: Add sort by
  ) {
    return await this.problemApplication.getProblemList({
      page,
      pageSize,
      contestTypes,
      keyword,
    });
  }

  @Get(':problemId')
  async getProblemDetail(@Param('problemId') problemId: string) {
    return await this.problemApplication.getProblemDetail(problemId);
  }

  @AuthenticationRequired()
  @Get(':problemId/my-editorial')
  async getMyProblemEditorial(
    @Param('problemId') problemId: string,
    @Requester() user: User,
  ) {
    return await this.editorialApplication.getMyProblemEditorial(
      problemId,
      user,
    );
  }

  @Get(':problemId/editorial')
  async getProblemEditorialList(
    @Param('problemId') problemId: string,
    @Query('page', new ParseIntPipe({ optional: true })) page?: number,
    @Query('pageSize', new ParseIntPipe({ optional: true })) pageSize?: number,
    @Query('sortBy') sortBy?: EditorialListSortBy, // TODO: add validation
    @Requester() requester?: User,
  ) {
    return await this.editorialApplication.getProblemEditorialList(
      problemId,
      {
        page,
        pageSize,
        sortBy,
      },
      requester,
    );
  }

  @AuthenticationRequired()
  @Post(':problemId/my-editorial/update')
  async updateMyProblemEditorial(
    @Requester() user: User,
    @Param('problemId') problemId: string,
    @Body() dto: UpdateEditorialDto,
  ) {
    return await this.editorialApplication.updateMyEditorial(
      user,
      problemId,
      dto.content,
    );
  }

  @AuthenticationRequired()
  @Post(':problemId/my-editorial/delete')
  async deleteMyProblemEditorial(
    @Requester() user: User,
    @Param('problemId') problemId: string,
  ) {
    return await this.editorialApplication.deleteMyEditorial(user, problemId);
  }
}
