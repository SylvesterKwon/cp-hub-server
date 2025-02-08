import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import dayjs from 'dayjs';
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
