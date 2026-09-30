import { prisma } from "@/lib/db";
import type { DashboardPullRequest, DashboardPullRequestDetail } from "../lib/pull-request-types";

const pullRequestFields = {
  id: true,
  repoFullName: true,
  prNumber: true,
  title: true,
  authorLogin: true,
  headSha: true,
  baseBranch: true,
  status: true,
  reviewedAt: true,
  createdAt: true,
  updatedAt: true,
} as const;

function toDashboardPullRequest<
  T extends {
    reviewedAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
  },
>(
  pullRequest: T
): Omit<T, "reviewedAt" | "createdAt" | "updatedAt"> & {
  reviewedAt: string | null;
  createdAt: string;
  updatedAt: string;
} {
  return {
    ...pullRequest,
    reviewedAt: pullRequest.reviewedAt?.toISOString() ?? null,
    createdAt: pullRequest.createdAt.toISOString(),
    updatedAt: pullRequest.updatedAt.toISOString(),
  };
}

export async function getDashboardPullRequests(installationId: number): Promise<DashboardPullRequest[]> {
  const pullRequests = await prisma.pullRequest.findMany({
    where: { installationId },
    orderBy: { updatedAt: "desc" },
    take: 25,
    select: pullRequestFields,
  });

  return pullRequests.map(toDashboardPullRequest);
}

export async function getDashboardPullRequestDetail(
  id: string,
  installationId: number
): Promise<DashboardPullRequestDetail | null> {
  const pullRequest = await prisma.pullRequest.findFirst({
    where: { id, installationId },
    select: { ...pullRequestFields, reviewComment: true },
  });

  if (!pullRequest) return null;

  return toDashboardPullRequest(pullRequest);
}
