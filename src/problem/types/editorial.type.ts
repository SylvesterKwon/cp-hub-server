import { CommentContextId } from 'src/comment/entities/comment.entity';
import { ReferenceSourceType } from 'src/reference/entities/reference.entity';

export type EditorialListSortBy =
  | 'recommended'
  | 'trending'
  | 'createdAtAsc'
  | 'updatedAtDesc';

export type CitationInformation = {
  sourceType: ReferenceSourceType;
  sourceId: string;
  sourceAuthorUsername?: string;
  createdAt: Date;
  updatedAt: Date;
  sourceCommentContextId?: CommentContextId;
  sourceEditorialProblemId?: string;
};
