import type { Metadata } from "next";
import { requireAuth } from "@/features/auth/actions";
import { getUserInstallationId } from "@/features/github/server/installation";
import { getDashboardPullRequests } from "@/features/dashboard/server/pull-requests";
import DashboardHeader from "@/features/dashboard/components/DashboardHeader";
import PullRequestReviewPage from "@/features/dashboard/components/PullRequestReviewPage";

export const metadata: Metadata = {
  title: "Pull Request Review - Dashboard",
};

export default async function DashboardPullRequestPage() {
  const session = await requireAuth();
  const installationId = await getUserInstallationId(session.user.id);
  const pullRequests = installationId ? await getDashboardPullRequests(installationId) : [];

  return (
    <>
      <DashboardHeader
        title="Pull Requests"
        description="Review automated feedback and changed files across connected repositories."
      />
      <PullRequestReviewPage initialPullRequests={pullRequests} isGithubConnected={Boolean(installationId)} />
    </>
  );
}
