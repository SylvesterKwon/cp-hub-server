export type CommentResponse = {
  id: string;
  isDeleted: boolean;
  content?: string;
  createdAt: Date;
  updatedAt: Date;
  author?: {
    id: string;
    username: string;
    profilePictureUrl?: string;
  };
  childComments: CommentResponse[];
};
