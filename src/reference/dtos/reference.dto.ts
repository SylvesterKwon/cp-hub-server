import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsString,
  ValidateNested,
} from 'class-validator';
import { ReferenceTargetType } from '../entities/reference.entity';

export class GetReferenceInfoBulkDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ReferenceTypeDto)
  ids: ReferenceTypeDto[];
}

export class ReferenceTypeDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsEnum(ReferenceTargetType)
  type: ReferenceTargetType;
}
