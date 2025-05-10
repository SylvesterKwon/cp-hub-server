import { Body, Controller, Post } from '@nestjs/common';
import { ReferenceApplication } from './applications/reference.application';
import { GetReferenceInfoBulkDto } from './dtos/reference.dto';

@Controller('reference')
export class ReferenceController {
  constructor(private referenceApplication: ReferenceApplication) {}

  @Post('info-bulk')
  async getReferenceInfoBulk(@Body() dto: GetReferenceInfoBulkDto) {
    return await this.referenceApplication.getReferenceInfoBulk(dto.ids);
  }
}
