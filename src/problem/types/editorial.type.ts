import { PopulatedComment } from 'src/comment/types/comment.type';
import { ReferenceSourceType } from 'src/reference/entities/reference.entity';

export type EditorialListSortBy =
  | 'recommended'
  | 'trending'
  | 'createdAtAsc'
  | 'updatedAtDesc';

export type CitationInformation = {
  sourceType: ReferenceSourceType;
  createdAt: Date;
  source?: {
    id: string;
    author: {
      id: string;
      username: string;
      profilePictureUrl?: string;
    };
  } & (CommentSourceInformation | EditorialSourceInformation);
};

export type CommentSourceInformation = {
  context: PopulatedComment['context'];
};

export type EditorialSourceInformation = {
  problem: {
    id: string;
    name: string;
  };
};
