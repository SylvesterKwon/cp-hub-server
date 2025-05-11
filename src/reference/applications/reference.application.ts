import { Injectable } from '@nestjs/common';
import { MikroORM } from '@mikro-orm/core';
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

  // WIP - referecnce source modified 이벤트 발생시에 수행되도록 로직 수정
  // https://docs.nestjs.com/techniques/events 참조하기
  async updateReference(
    sourceType: ReferenceSourceType,
    sourceId: string,
    content: string,
  ) {
    return await this.referenceService.updateReference(
      sourceType,
      sourceId,
      content,
    );
  }
}
