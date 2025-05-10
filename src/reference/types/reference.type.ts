export type ProblemReferenceInfo = {
  id: string;
  name: string;
};
export type ContestReferenceInfo = {
  id: string;
  name: string;
};
export type EditorialReferenceInfo = {
  id: string;
  problem: {
    id: string;
    name: string;
  };
  author: {
    id: string;
    username: string;
  };
};
export type UserReferenceInfo = {
  id: string;
  name: string;
};

export type GetReferenceInfoBulkResponse = {
  problems: ProblemReferenceInfo[];
  contests: ContestReferenceInfo[];
  editorials: EditorialReferenceInfo[];
  users: UserReferenceInfo[];
};
