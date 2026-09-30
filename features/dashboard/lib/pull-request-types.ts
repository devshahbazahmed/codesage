export type DashboardPullRequest = {
  id: string;
  repoFullName: string;
  prNumber: number;
  title: string;
  authorLogin: string | null;
  headSha: string;
  baseBranch: string;
  status: string;
  reviewedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type DashboardPullRequestDetail = DashboardPullRequest & {
  reviewComment: string | null;
};

export type DashboardPullRequestFile = {
  filePath: string;
  patch: string;
  additions: number;
  deletions: number;
  changes: number;
  status: string;
};