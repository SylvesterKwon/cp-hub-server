import { Entity, Enum, Index, JsonType, Opt, Property } from '@mikro-orm/core';
import { ReferenceRepository } from '../repositories/reference.repository';
import { TimestampedEntity } from 'src/common/entities/timestamped-entity.entity';

export type ReferenceDenormalizedInfo = {
  sourceAuthorId: string;
  targetAuthorId?: string; // must exists if targetType is editorial
};

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

  @Property({
    type: JsonType,
  })
  denormalizedInfo: Opt<ReferenceDenormalizedInfo>;
}

// NOTE: all reference source entity must have "author" property
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
