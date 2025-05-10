import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsString,
  ValidateNested,
} from 'class-validator';

// TODO: move enum definition to entity file
export enum ReferenceType {
  PROBLEM = 'problem',
  EDITORIAL = 'editorial',
  CONTEST = 'contest',
  USER = 'user',
}

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
  @IsEnum(ReferenceType)
  type: ReferenceType;
}
