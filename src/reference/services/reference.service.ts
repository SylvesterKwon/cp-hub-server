import { Injectable } from '@nestjs/common';
import { ProblemRepository } from 'src/problem/repositories/problem.repository';
import { ContestRepository } from 'src/problem/repositories/contest.repository';
import { UserRepository } from 'src/user/repositories/user.repositories';
import { EditorialRepository } from 'src/problem/repositories/editorial.repository';
import { ReferenceTypeDto } from '../dtos/reference.dto';
import {
  Reference,
  ReferenceSourceType,
  ReferenceTargetType,
} from '../entities/reference.entity';
import { CommentRepository } from 'src/comment/repositories/comment.repository';
import { ReferenceRepository } from '../repositories/reference.repository';
import { EventManagerService } from 'src/event-manager/event-manager.service';
import { User } from 'src/user/entities/user.entity';
import { raw, sql } from '@mikro-orm/core';
import { ReferenceSourceNotFoundException } from 'src/common/exceptions/reference.exception';
import { Editorial } from 'src/problem/entities/editorial.entity';

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
    private eventManagerService: EventManagerService,
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
    const source = await this.getReferenceSourceRepository(sourceType).findOne({
      id: sourceId,
    });
    if (!source) throw new ReferenceSourceNotFoundException();
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
    const toBeAddedTargets = targets.map((target) => {
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
    const toBeAdded = toBeAddedTargets.flatMap((target) =>
      target.ids.map((id) =>
        this.referenceRepository.create({
          sourceType: sourceType,
          sourceId: sourceId,
          targetType: target.type,
          targetId: id,
        }),
      ),
    );
    const addedEditorialReferences = toBeAdded.filter(
      (item) => item.targetType === ReferenceTargetType.EDITORIAL,
    );
    const addedReferencedEditorialIds = addedEditorialReferences.map(
      (item) => item.targetId,
    );
    const addedReferencedEditorial = await this.editorialRepository.find({
      id: {
        $in: addedReferencedEditorialIds,
      },
    });
    addedEditorialReferences.forEach((item) => {
      item.denormalizedInfo = {
        sourceAuthorId: source.author.id,
        targetAuthorId: addedReferencedEditorial.find(
          (editorial) => editorial.id === item.targetId,
        )!.author.id,
      };
    });

    let citationMetricsUpdateTagetUserIds = addedEditorialReferences.map(
      (item) => item.denormalizedInfo!.targetAuthorId!,
    );
    citationMetricsUpdateTagetUserIds =
      citationMetricsUpdateTagetUserIds.concat(
        toBeDeleted
          .filter((item) => item.targetType === ReferenceTargetType.EDITORIAL)
          .map((item) => item.denormalizedInfo!.targetAuthorId!),
      );
    const hIndexUpdateTargetUsers = await this.userRepository.find({
      id: {
        $in: citationMetricsUpdateTagetUserIds,
      },
    });
    await this.referenceRepository.getEntityManager().flush();
    await this.updateCitationMetrics(hIndexUpdateTargetUsers);
  }

  async deleteReference(sourceType: ReferenceSourceType, sourceId: string) {
    const source = await this.getReferenceSource(sourceType, sourceId);
    if (!source) throw new ReferenceSourceNotFoundException();

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

  async updateCitationMetrics(users: User[]) {
    const qb = this.referenceRepository
      .getEntityManager()
      .createQueryBuilder(Reference);
    for (const user of users) {
      const res = await qb
        .select(['target_id', sql`count(id) as count`])
        .where({
          targetType: ReferenceTargetType.EDITORIAL,
          denormalizedInfo: {
            targetAuthorId: user.id,
          },
        })
        .groupBy('target_id')
        .orderBy({
          [raw(`count`)]: 'desc',
        })
        .execute<{ targetId: string; count: string }[]>();
      const xx = res.map((item) => ({
        targetId: item.targetId,
        count: parseInt(item.count),
      }));
      let hIndex = 0,
        gIndex = 0;
      let sum = 0;
      for (let i = 0; i < xx.length; i++) {
        if (xx[i].count >= i + 1) {
          hIndex = i + 1;
        } else {
          break;
        }
      }
      for (let i = 0; i < xx.length; i++) {
        sum += xx[i].count;
        if (sum >= (i + 1) * (i + 1)) {
          gIndex = i + 1;
        } else {
          break;
        }
      }
      user.denormalizedInfo.hIndex = hIndex;
      user.denormalizedInfo.gIndex = gIndex;
    }
  }

  async getCitations(editorial: Editorial) {
    return await this.referenceRepository.find(
      {
        targetType: ReferenceTargetType.EDITORIAL,
        targetId: editorial.id,
      },
      {
        orderBy: {
          createdAt: 'desc',
        },
      },
    );
  }
}
