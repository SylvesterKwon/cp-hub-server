import { BadRequestException, Injectable } from '@nestjs/common';
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
import {
  CitationInformation,
  EditorialListSortBy,
} from '../types/editorial.type';
import { ReferenceService } from 'src/reference/services/reference.service';
import { ReferenceSourceType } from 'src/reference/entities/reference.entity';
import { CommentRepository } from 'src/comment/repositories/comment.repository';
import { CommentService } from 'src/comment/services/comment.service';

@Injectable()
export class EditorialApplication {
  constructor(
    private orm: MikroORM,
    private editorialService: EditorialService,
    private editorialRepository: EditorialRepository,
    private problemRepository: ProblemRepository,
    private userRepository: UserRepository,
    private voteService: VoteService,
    private referenceService: ReferenceService,
    private commentRepository: CommentRepository,
    private commentService: CommentService,
  ) {}

  @Transactional()
  async getEditorialList(option: {
    page?: number;
    pageSize?: number;
    sortBy?: EditorialListSortBy;
    requester?: User;
  }) {
    if (option.sortBy === 'trending')
      throw new BadRequestException(
        'Problem ID must be specified for sort by trending',
      );

    const { editorials, totalCount } =
      await this.editorialService.getEditorialList({
        page: option.page,
        pageSize: option.pageSize,
        sortBy: option.sortBy,
        populateProblem: true,
      });

    let results = editorials.map(this.convertEditorialToDto);

    if (option.requester) {
      const voteStatuses = await this.voteService.getVoteStatuses(
        option.requester,
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

  async getEditorial(editorialId: string) {
    const editorial = await this.editorialRepository.findOne(
      {
        id: editorialId,
      },
      {
        populate: ['author'],
      },
    );
    if (!editorial) throw new EditorialNotFoundException();

    return this.convertEditorialToDto(editorial);
  }

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
    editorial: Loaded<Editorial, 'author' | 'problem', '*', never>,
  ) {
    return {
      id: editorial.id,
      createdAt: editorial.createdAt,
      updatedAt: editorial.updatedAt,
      content: editorial.content,
      author: {
        username: editorial.author.username,
        profilePictureUrl: editorial.author.profilePictureUrl,
      },
      commentCount: editorial.denormalizedInfo.commentCount,
      upvoteCount: editorial.denormalizedInfo.upvoteCount,
      downvoteCount: editorial.denormalizedInfo.downvoteCount,
      problem: {
        id: editorial.problem.id,
        name: editorial.problem.name,
      },
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

  async getCitations(editorialId: string) {
    const editorial = await this.editorialRepository.findOne({
      id: editorialId,
    });
    if (!editorial) throw new EditorialNotFoundException();
    const citations = await this.referenceService.getCitations(editorial);

    const sourceComments = await this.commentRepository.find(
      {
        id: {
          $in: citations
            .filter(
              (citation) => citation.sourceType === ReferenceSourceType.COMMENT,
            )
            .map((citation) => citation.sourceId),
        },
      },
      {
        populate: ['author'],
      },
    );
    const poppulatedSourceComments =
      await this.commentService.populateCommentContext(sourceComments);
    const sourceEditorials = await this.editorialRepository.find(
      {
        id: {
          $in: citations
            .filter(
              (citation) =>
                citation.sourceType === ReferenceSourceType.EDITORIAL,
            )
            .map((citation) => citation.sourceId),
        },
      },
      {
        populate: ['problem', 'author'],
      },
    );

    const citationInformations = citations.map(
      (citation): CitationInformation => {
        const res: CitationInformation = {
          sourceType: citation.sourceType,
          createdAt: citation.createdAt,
        };
        if (citation.sourceType === ReferenceSourceType.COMMENT) {
          const sourceComment = poppulatedSourceComments.find(
            (comment) => comment.id === citation.sourceId,
          );
          // console.log('sourceComment', sourceComment);
          if (sourceComment)
            res.source = {
              id: sourceComment.id,
              author: {
                id: sourceComment.author.id,
                username: sourceComment.author.username,
                profilePictureUrl: sourceComment.author.profilePictureUrl,
              },
              context: sourceComment.context,
            };
        } else if (citation.sourceType === ReferenceSourceType.EDITORIAL) {
          const sourceEditorial = sourceEditorials.find(
            (editorial) => editorial.id === citation.sourceId,
          );
          if (sourceEditorial)
            res.source = {
              id: sourceEditorial?.id,
              author: {
                id: sourceEditorial.author.id,
                username: sourceEditorial.author.username,
                profilePictureUrl: sourceEditorial.author.profilePictureUrl,
              },
              problem: {
                id: sourceEditorial.problem.id,
                name: sourceEditorial.problem.name,
              },
            };
        }

        return res;
      },
    );
    return {
      totalCount: citationInformations.length,
      results: citationInformations,
    };
  }
}
