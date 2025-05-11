import { Entity, Enum, Index, Property } from '@mikro-orm/core';
import { ReferenceRepository } from '../repositories/reference.repository';
import { TimestampedEntity } from 'src/common/entities/timestamped-entity.entity';

@Entity({ repository: () => ReferenceRepository })
export class Reference extends TimestampedEntity {
  @Enum(() => ReferenceSourceType)
  sourceType: ReferenceSourceType;

  @Property()
  @Index()
  sourceId: string;

  @Enum(() => ReferenceTargetType)
  targetType: ReferenceTargetType;

  @Property()
  @Index()
  targetId: string;
}

export enum ReferenceSourceType {
  COMMENT = 'comment',
  EDITORIAL = 'editorial',
}

export enum ReferenceTargetType {
  PROBLEM = 'problem',
  EDITORIAL = 'editorial',
  CONTEST = 'contest',
  USER = 'user',
}
