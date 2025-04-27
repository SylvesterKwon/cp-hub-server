import { Injectable } from '@nestjs/common';
import { EditorialRepository } from '../repositories/editorial.repository';
import { Loaded, MikroORM, Transactional } from '@mikro-orm/core';
import { ProblemRepository } from '../repositories/problem.repository';
import {
  EditorialNotFoundException,
  ProblemNotFoundException,
} from 'src/common/exceptions/problem.exception';
import { UserRepository } from 'src/user/repositories/user.repositories';
import { EditorialService } from '../services/editorial.service';
import { User } from 'src/user/entities/user.entity';
import { Editorial } from '../entities/editorial.entity';
import { EditorialVoteAction, VoteService } from '../services/vote.service';
import { EditorialListSortBy } from '../types/editorial.type';

@Injectable()
export class EditorialApplication {
  constructor(
    private orm: MikroORM,
    private editorialService: EditorialService,
    private editorialRepository: EditorialRepository,
    private problemRepository: ProblemRepository,
    private userRepository: UserRepository,
    private voteService: VoteService,
  ) {}

  // TODO: updateMyEditorial, deleteMyEditorial 을 대응되는 controller 메서드명으로 수정하고 공통 로직을 service 레이어에 추상화
  @Transactional()
  async updateMyEditorial(user: User, problemId: string, content: string) {
    const problem = await this.problemRepository.findOne({ id: problemId });
    if (!problem) throw new ProblemNotFoundException();

    const editorial = await this.editorialService.updateEditorial(
      user,
      problem,
      content,
    );

    return {
      message: 'Editorial created/updated successfully',
      editorialId: editorial.id,
    };
  }

  @Transactional()
  async deleteMyEditorial(user: User, problemId: string) {
    const editorial = await this.editorialRepository.findOne({
      author: user,
      problem: { id: problemId },
    });
    if (!editorial) throw new EditorialNotFoundException();

    await this.editorialService.deleteEditorial(user, editorial);

    return { message: 'Editorial deleted successfully' };
  }

  async getMyProblemEditorial(problemId: string, user: User) {
    const problem = await this.problemRepository.findOne({
      id: problemId,
    });
    if (!problem) throw new ProblemNotFoundException();

    const { editorials } = await this.editorialService.getEditorialList({
      author: user,
      problem,
    });

    if (!editorials.length) throw new EditorialNotFoundException();

    return this.convertEditorialToDto(editorials[0]);
  }

  @Transactional()
  async getProblemEditorialList(
    problemId: string,
    option: {
      page?: number;
      pageSize?: number;
      sortBy?: EditorialListSortBy;
    },
    requester?: User,
  ) {
    const problem = await this.problemRepository.findOne({
      id: problemId,
    });
    if (!problem) throw new ProblemNotFoundException();

    const { editorials, totalCount } =
      await this.editorialService.getEditorialList({
        problem,
        page: option.page,
        pageSize: option.pageSize,
        sortBy: option.sortBy,
      });

    let results = editorials.map(this.convertEditorialToDto);

    if (requester) {
      const voteStatuses = await this.voteService.getVoteStatuses(
        requester,
        editorials,
      );
      results = results.map((editorial) => {
        const voteStatus = voteStatuses.find(
          (vote) => vote.editorialId === editorial.id,
        );
        return {
          ...editorial,
          myVote: voteStatus?.voteType,
        };
      });
    }

    return {
      results: results,
      totalCount: totalCount,
    };
  }

  private convertEditorialToDto(
    editorial: Loaded<Editorial, 'author', '*', never>,
  ) {
    return {
      id: editorial.id,
      createdAt: editorial.createdAt,
      updatedAt: editorial.updatedAt,
      content: editorial.content,
      author: {
        username: editorial.author.username,
      },
      upvoteCount: editorial.denormalizedInfo.upvoteCount,
      downvoteCount: editorial.denormalizedInfo.downvoteCount,
    };
  }

  @Transactional()
  async voteEditorial(
    editorialId: string,
    user: User,
    action: EditorialVoteAction,
  ) {
    const editorial = await this.editorialRepository.findOne({
      id: editorialId,
    });
    if (!editorial) throw new EditorialNotFoundException();
    await this.voteService.voteEditorial(editorial, user, action);

    return {
      message: 'Voted successfully',
      data: {
        editorialId: editorial.id,
        upvoteCount: editorial.denormalizedInfo.upvoteCount,
        downvoteCount: editorial.denormalizedInfo.downvoteCount,
        myVote: { upvote: 'upvote', downvote: 'downvote', undo: null }[action],
      },
    };
  }
}
