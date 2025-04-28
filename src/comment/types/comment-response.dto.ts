export type CommentResponse = {
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
