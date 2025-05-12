import { Injectable } from '@nestjs/common';
import { MikroORM, Transactional } from '@mikro-orm/core';
import { ReferenceTypeDto } from '../dtos/reference.dto';
import { ReferenceService } from '../services/reference.service';
import { ReferenceSourceType } from '../entities/reference.entity';

@Injectable()
export class ReferenceApplication {
  constructor(
    private orm: MikroORM,
    private referenceService: ReferenceService,
  ) {}

  async getReferenceInfoBulk(ids: ReferenceTypeDto[]) {
    return await this.referenceService.getReferenceInfoBulk(ids);
  }

  @Transactional()
  async updateReference(sourceType: ReferenceSourceType, sourceId: string) {
    const referenceSource = await this.referenceService.getReferenceSource(
      sourceType,
      sourceId,
    );
    if (!referenceSource) throw new Error('Reference source not found');
    return await this.referenceService.updateReference(
      sourceType,
      sourceId,
      referenceSource.content ?? '',
    );
  }

  @Transactional()
  async deleteReference(sourceType: ReferenceSourceType, sourceId: string) {
    return await this.referenceService.updateReference(
      sourceType,
      sourceId,
      '',
    );
  }
}
