import {
  Collection,
  Entity,
  JsonType,
  ManyToMany,
  ManyToOne,
  OneToMany,
  Opt,
  Property,
  Ref,
  Unique,
} from '@mikro-orm/core';
import { UserRepository } from '../repositories/user.repositories';
import { TimestampedEntity } from 'src/common/entities/timestamped-entity.entity';
import { Editorial } from 'src/problem/entities/editorial.entity';
import { Role } from './role.entity';

export type UserExternalPlatformIds = {
  codeforces?: string;
  atCoder?: string;
  baekjoonOnlineJudge?: string;
  gitHub?: string;
};

export type UserDenormalizedInfo = {
  hIndex: number;
  gIndex: number;
};

@Entity({ repository: () => UserRepository })
export class User extends TimestampedEntity {
  @Property()
  @Unique()
  username: string;

  @Property()
  @Unique()
  email: string;

  @Property()
  profilePictureUrl?: string;

  @Property()
  hashedPassword: string;

  @ManyToOne(() => Role)
  role?: Ref<Role>;

  @OneToMany(() => Editorial, (editorial) => editorial.author)
  authoredEditorials = new Collection<Editorial>(this);

  @ManyToMany(() => Editorial, (editorial) => editorial.votedBy)
  votedEditorials = new Collection<Editorial>(this);

  @Property({
    type: JsonType,
    nullable: true, // TODO: remove optional
  })
  externalPlatformIds?: Opt<UserExternalPlatformIds> = {};

  @Property({ columnType: 'text', length: 140 })
  biography?: string;

  @Property({
    type: JsonType,
  })
  denormalizedInfo: Opt<UserDenormalizedInfo> = {
    hIndex: 0,
    gIndex: 0,
  };
}
