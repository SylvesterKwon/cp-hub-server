import { Injectable } from '@nestjs/common';
import { ProblemRepository } from 'src/problem/repositories/problem.repository';
import { ContestRepository } from 'src/problem/repositories/contest.repository';
import { UserRepository } from 'src/user/repositories/user.repositories';
import { EditorialRepository } from 'src/problem/repositories/editorial.repository';
import { ReferenceTypeDto } from '../dtos/reference.dto';
import {
  ReferenceSourceType,
  ReferenceTargetType,
} from '../entities/reference.entity';
import { CommentRepository } from 'src/comment/repositories/comment.repository';
import { ReferenceRepository } from '../repositories/reference.repository';

@Injectable()
export class ReferenceService {
  referenceExtractRules: {
    type: ReferenceTargetType;
    regex: RegExp;
    idField?: string;
    matchIndex?: number;
  }[] = [
    {
      type: ReferenceTargetType.USER,
      regex: /(?<=^|\s)@([A-Za-z0-9_]+)/g,
      idField: 'username',
    },
    {
      type: ReferenceTargetType.PROBLEM,
      regex: /(?<=^|\s)p#([A-Za-z0-9_]+)/g,
    },
    {
      type: ReferenceTargetType.CONTEST,
      regex: /(?<=^|\s)c#([A-Za-z0-9_]+)/g,
    },
    {
      type: ReferenceTargetType.EDITORIAL,
      regex: /(?<=^|\s)e#([A-Za-z0-9_]+)/g,
    },
  ];

  constructor(
    private referenceRepository: ReferenceRepository,
    private userRepository: UserRepository,
    private editorialRepository: EditorialRepository,
    private problemRepository: ProblemRepository,
    private contestRepository: ContestRepository,
    private commentRepository: CommentRepository,
  ) {}

  private getReferenceSourceRepository(type: ReferenceSourceType) {
    switch (type) {
      case ReferenceSourceType.COMMENT:
        return this.commentRepository;
      case ReferenceSourceType.EDITORIAL:
        return this.editorialRepository;
      default:
        throw new Error('Invalid reference source type');
    }
  }

  private getReferenceTargetRepository(type: ReferenceTargetType) {
    switch (type) {
      case ReferenceTargetType.PROBLEM:
        return this.problemRepository;
      case ReferenceTargetType.CONTEST:
        return this.contestRepository;
      case ReferenceTargetType.EDITORIAL:
        return this.editorialRepository;
      case ReferenceTargetType.USER:
        return this.userRepository;
      default:
        throw new Error('Invalid reference target type');
    }
  }

  async getReferenceSource(type: ReferenceSourceType, id: string) {
    return await this.getReferenceSourceRepository(type).findOne(id);
  }

  async getReferenceTarget(type: ReferenceTargetType, id: string) {
    return await this.getReferenceTargetRepository(type).findOne(id);
  }

  private async extractTargetsFromContent(content: string) {
    const targets: { type: ReferenceTargetType; ids: string[] }[] =
      await Promise.all(
        this.referenceExtractRules.map(async (rule) => {
          // extract ids from content
          const ids: string[] = [];
          let match;
          while ((match = rule.regex.exec(content)) !== null) {
            ids.push(match[rule.matchIndex ?? 1]);
          }

          // filter non-existing ids & remove duplicates
          const existingTargets = await this.getReferenceTargetRepository(
            rule.type,
          ).find({
            [rule.idField ?? 'id']: {
              $in: ids,
            },
          });

          return {
            type: rule.type,
            ids: existingTargets.map((target) => target.id),
          };
        }),
      );
    return targets;
  }

  async updateReference(
    sourceType: ReferenceSourceType,
    sourceId: string,
    content: string,
  ) {
    const existingReferences = await this.referenceRepository.find({
      sourceId: sourceId,
      sourceType: sourceType,
    });
    const targets = await this.extractTargetsFromContent(content);

    const toBeDeleted = existingReferences.filter((reference) => {
      return !targets
        .find((t) => t.type === reference.targetType)!
        .ids.find((id) => id === reference.targetId);
    });
    const toBeAdded = targets.map((target) => {
      return {
        type: target.type,
        ids: target.ids.filter(
          (id) =>
            !existingReferences.find(
              (reference) =>
                reference.targetType === target.type &&
                reference.targetId === id,
            ),
        ),
      };
    });

    this.referenceRepository.getEntityManager().remove(toBeDeleted);
    for (const target of toBeAdded) {
      for (const id of target.ids) {
        this.referenceRepository.create({
          sourceType: sourceType,
          sourceId: sourceId,
          targetType: target.type,
          targetId: id,
        });
      }
    }

    if (process.env.ENVIRONMENT === 'local') {
      console.log('Reference Added:', toBeAdded);
      console.log('Reference Deleted:', toBeDeleted);
    }

    // TODO: h-index calculation list up and emit event
  }

  async deleteReference(sourceType: ReferenceSourceType, sourceId: string) {
    const source = await this.getReferenceSource(sourceType, sourceId);
    if (!source) throw new Error('Source not found');

    const references = await this.referenceRepository.find({
      sourceId: sourceId,
      sourceType: sourceType,
    });
    this.referenceRepository.getEntityManager().remove(references);
  }

  async getReferenceInfoBulk(ids: ReferenceTypeDto[]) {
    const problems = await this.problemRepository.find({
      id: {
        $in: ids
          .filter((i) => i.type === ReferenceTargetType.PROBLEM)
          .map((i) => i.id),
      },
    });
    const contests = await this.contestRepository.find({
      id: {
        $in: ids
          .filter((i) => i.type === ReferenceTargetType.CONTEST)
          .map((i) => i.id),
      },
    });
    const editorials = await this.editorialRepository.find(
      {
        id: {
          $in: ids
            .filter((i) => i.type === ReferenceTargetType.EDITORIAL)
            .map((i) => i.id),
        },
      },
      { populate: ['problem', 'author'] },
    );
    const users = await this.userRepository.find({
      username: {
        $in: ids
          .filter((i) => i.type === ReferenceTargetType.USER)
          .map((i) => i.id),
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
