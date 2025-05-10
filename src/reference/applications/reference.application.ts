import { Injectable } from '@nestjs/common';
import { MikroORM } from '@mikro-orm/core';
import { ReferenceTypeDto } from '../dtos/reference.dto';
import { ReferenceService } from '../services/reference.service';

@Injectable()
export class ReferenceApplication {
  constructor(
    private orm: MikroORM,
    private referenceService: ReferenceService,
  ) {}

  async getReferenceInfoBulk(ids: ReferenceTypeDto[]) {
    return await this.referenceService.getReferenceInfoBulk(ids);
  }
}
