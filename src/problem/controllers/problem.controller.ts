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
import { UserId } from 'src/common/decorators/user.decorator';
import { UpdateEditorialDto } from './dtos/editorial.dto';

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
  @Post(':problemId/my-editorial/update')
  async udpateEditorial(
    @UserId() userid: string,
    @Param('problemId') problemId: string,
    @Body() dto: UpdateEditorialDto,
  ) {
    return await this.editorialApplication.updateEditorial(
      userid,
      problemId,
      dto.content,
    );
  }

  @AuthenticationRequired()
  @Post(':problemId/my-editorial/delete')
  async deleteEditorial(
    @UserId() userid: string,
    @Param('problemId') problemId: string,
  ) {
    return await this.editorialApplication.deleteEditorial(userid, problemId);
  }
}
