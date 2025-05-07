import { Injectable } from '@nestjs/common';
import { User } from 'src/user/entities/user.entity';
import { EditorialRepository } from '../repositories/editorial.repository';
import { Editorial } from '../entities/editorial.entity';
import {
  EditorialVotes,
  EditorialVoteType,
} from '../entities/editorial-votes.entity';
import { EditorialVotesRepository } from '../repositories/editorial-votes.repository';
import {
  DuplicatedVoteException,
  SelfVoteException,
  VoteNotFoundException,
} from 'src/common/exceptions/vote.exception';
import { EditorialService } from './editorial.service';

@Injectable()
export class VoteService {
  constructor(
    private editorialService: EditorialService,
    private editorialRepository: EditorialRepository,
    private editorialVotesRepository: EditorialVotesRepository,
  ) {}

  private editorialVoteActionToTypeMap = {
    [EditorialVoteAction.UPVOTE]: EditorialVoteType.UPVOTE,
    [EditorialVoteAction.DOWNVOTE]: EditorialVoteType.DOWNVOTE,
  };

  async voteEditorial(
    editorial: Editorial,
    user: User,
    action: EditorialVoteAction,
  ) {
    if (user.id === editorial.author.id) throw new SelfVoteException();
    const existingVote = await this.editorialVotesRepository.findOne({
      editorial,
      user,
    });
    if (action === EditorialVoteAction.UNDO && !existingVote)
      throw new VoteNotFoundException();
    if (existingVote) {
      if (
        action !== EditorialVoteAction.UNDO &&
        existingVote.type === this.editorialVoteActionToTypeMap[action]
      )
        throw new DuplicatedVoteException();
      this.undoVote(editorial, existingVote);
    }
    if (action === EditorialVoteAction.UNDO) return;

    if (action === EditorialVoteAction.UPVOTE) {
      this.upvote(editorial, user);
      // When upvote, recalculate EDS and cache
      this.editorialService.recalculateExponentialDecayScore(editorial, 100);
    } else if (action === EditorialVoteAction.DOWNVOTE)
      this.downvote(editorial, user);

    await this.editorialService.calculateWilsonScoreInterval(editorial);
  }

  private undoVote(editorial: Editorial, existingVote: EditorialVotes) {
    if (!existingVote) throw new VoteNotFoundException();

    if (existingVote.type === EditorialVoteType.UPVOTE)
      editorial.denormalizedInfo.upvoteCount--;
    else if (existingVote.type === EditorialVoteType.DOWNVOTE)
      editorial.denormalizedInfo.downvoteCount--;
    this.editorialVotesRepository.getEntityManager().remove(existingVote);
  }

  private upvote(editorial: Editorial, user: User) {
    editorial.denormalizedInfo.upvoteCount++;
    this.editorialVotesRepository.create({
      editorial,
      user,
      type: EditorialVoteType.UPVOTE,
    });
  }

  private async downvote(editorial: Editorial, user: User) {
    editorial.denormalizedInfo.downvoteCount++;
    this.editorialVotesRepository.create({
      editorial,
      user,
      type: EditorialVoteType.DOWNVOTE,
    });
  }

  async getVoteStatuses(user: User, editorials: Editorial[]) {
    const result = await this.editorialVotesRepository.find({
      user,
      editorial: { $in: editorials },
    });
    return editorials.map((editorial) => ({
      editorialId: editorial.id,
      voteType:
        result.find((vote) => vote.editorial.id === editorial.id)?.type ?? null,
    }));
  }
}

export enum EditorialVoteAction {
  UPVOTE = EditorialVoteType.UPVOTE,
  DOWNVOTE = EditorialVoteType.DOWNVOTE,
  UNDO = 'undo',
}
