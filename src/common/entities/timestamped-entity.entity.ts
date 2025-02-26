import { Entity, PrimaryKey, Property, Unique } from '@mikro-orm/core';
import dayjs from 'dayjs';
import { nanoid } from 'nanoid';
import { v4 } from 'uuid';

@Entity({ abstract: true })
export class TimestampedEntity {
  @PrimaryKey()
  id: string = v4();

  @Property({
    onCreate: () => dayjs().utc().toDate(),
    defaultRaw: 'now()',
  })
  createdAt?: Date;

  @Property({
    onCreate: () => dayjs().utc().toDate(),
    onUpdate: () => dayjs().utc().toDate(),
    defaultRaw: 'now()',
  })
  updatedAt?: Date;
}

/**
 * Base entity with a URL-friendly short ID and timestamps.
 */
@Entity({ abstract: true })
export class TimestampedShortIdEntity extends TimestampedEntity {
  @PrimaryKey({ length: 11 })
  @Unique()
  id: string = nanoid(11); // TODO: need to implement hash collision handling
}
