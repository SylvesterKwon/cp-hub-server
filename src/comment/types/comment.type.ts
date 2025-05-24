import { Problem } from 'src/problem/entities/problem.entity';
import { Contest } from 'src/problem/entities/contest.entity';
import { Editorial } from 'src/problem/entities/editorial.entity';
import { Comment, CommentContextType } from '../entities/comment.entity';

export type CommentDenormalizedInfo = {
  commentCount: number;
};

export type PopulatedComment<T extends Comment = Comment> = T & {
  context?:
    | ({ type: CommentContextType.CONTEST } & Pick<Contest, 'id' | 'name'>)
    | ({ type: CommentContextType.EDITORIAL } & (Pick<Editorial, 'id'> & {
        author: Pick<
          Editorial['author'],
          'id' | 'username' | 'profilePictureUrl'
        >;
        problem: Pick<Editorial['problem'], 'id' | 'name'>;
      }))
    | ({ type: CommentContextType.PROBLEM } & Pick<Problem, 'id' | 'name'>);
};
