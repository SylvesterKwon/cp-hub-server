export type CommentResponse = {
  id: string;
  isDeleted: boolean;
  content?: string;
  createdAt: Date;
  updatedAt: Date;
  author?: {
    username: string;
    profilePictureUrl?: string;
  };
  childComments: CommentResponse[];
};
