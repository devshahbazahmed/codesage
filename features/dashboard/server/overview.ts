import { prisma } from "@/lib/db";
import { getDashboardPullRequests } from "./pull-requests";
import type { DashboardOverview } from "../lib/overview-types";

export async function getDashboardOverview(installationId: number): Promise<DashboardOverview> {
  const where = { installationId };
  const [totalPullRequests, awaitingReview, reviewed, pullRequests] = await Promise.all([
    prisma.pullRequest.count({ where }),
    prisma.pullRequest.count({
      where: { ...where, status: { in: ["pending", "processing"] } },
    }),
    prisma.pullRequest.count({ where: { ...where, status: "reviewed" } }),
    getDashboardPullRequests(installationId),
  ]);

  return {
    stats: { totalPullRequests, awaitingReview, reviewed },
    recentPullRequests: pullRequests.slice(0, 8),
  };
}
