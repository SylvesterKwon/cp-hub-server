import { Injectable } from '@nestjs/common';
import { ProblemRepository } from 'src/problem/repositories/problem.repository';
import { ContestRepository } from 'src/problem/repositories/contest.repository';
import { UserRepository } from 'src/user/repositories/user.repositories';
import { EditorialRepository } from 'src/problem/repositories/editorial.repository';
import { ReferenceType, ReferenceTypeDto } from '../dtos/reference.dto';

@Injectable()
export class ReferenceService {
  constructor(
    private userRepository: UserRepository,
    private editorialRepository: EditorialRepository,
    private problemRepository: ProblemRepository,
    private contestRepository: ContestRepository,
  ) {}

  async getReferenceInfoBulk(ids: ReferenceTypeDto[]) {
    const problems = await this.problemRepository.find({
      id: {
        $in: ids
          .filter((i) => i.type === ReferenceType.PROBLEM)
          .map((i) => i.id),
      },
    });
    const contests = await this.contestRepository.find({
      id: {
        $in: ids
          .filter((i) => i.type === ReferenceType.CONTEST)
          .map((i) => i.id),
      },
    });
    const editorials = await this.editorialRepository.find(
      {
        id: {
          $in: ids
            .filter((i) => i.type === ReferenceType.EDITORIAL)
            .map((i) => i.id),
        },
      },
      { populate: ['problem', 'author'] },
    );
    const users = await this.userRepository.find({
      username: {
        $in: ids.filter((i) => i.type === ReferenceType.USER).map((i) => i.id),
      },
    });

    return {
      problems: problems.map((problem) => ({
        id: problem.id,
        name: problem.name,
      })),
      contests: contests.map((contest) => ({
        id: contest.id,
        name: contest.name,
      })),
      editorials: editorials.map((editorial) => ({
        id: editorial.id,
        problem: {
          id: editorial.problem.id,
          name: editorial.problem.name,
        },
        author: {
          id: editorial.author.id,
          username: editorial.author.username,
          profilePictureUrl: editorial.author.profilePictureUrl,
        },
      })),
      users: users.map((user) => ({
        id: user.id,
        username: user.username,
        profilePictureUrl: user.profilePictureUrl,
      })),
    };
  }
}
