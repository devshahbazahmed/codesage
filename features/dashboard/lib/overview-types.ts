import type { DashboardPullRequest } from "./pull-request-types";

export type DashboardOverview = {
  stats: {
    totalPullRequests: number;
    awaitingReview: number;
    reviewed: number;
  };
  recentPullRequests: DashboardPullRequest[];
};
