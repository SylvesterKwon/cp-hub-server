import {
  IsEnum,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { CommentContextType } from '../entities/comment.entity';
import { Type } from 'class-transformer';

export class CommentContextDto {
  @IsEnum(CommentContextType)
  type: CommentContextType;

  @IsString()
  @IsNotEmpty()
  id: string;
}

export class AddCommentDto {
  @IsObject()
  @ValidateNested()
  @Type(() => CommentContextDto)
  context: CommentContextDto;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsString()
  @IsOptional()
  parentCommentId?: string;
}

export class EditCommentDto {
  @IsString()
  @IsNotEmpty()
  content: string;
}
