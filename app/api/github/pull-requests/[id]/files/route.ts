import { getServerSession } from "@/features/auth/actions";
import { getUserInstallationId } from "@/features/github/server/installation";
import { getDashboardPullRequestDetail } from "@/features/dashboard/server/pull-requests";
import { getPullRequestFiles } from "@/features/reviews/server/prFiles";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession();

  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const installationId = await getUserInstallationId(session.user.id);

  if (!installationId) {
    return Response.json({ error: "GitHub App not connected" }, { status: 400 });
  }

  const { id } = await params;
  const pullRequest = await getDashboardPullRequestDetail(id, installationId);

  if (!pullRequest) {
    return Response.json({ error: "Pull request not found" }, { status: 404 });
  }

  const files = await getPullRequestFiles(installationId, pullRequest.repoFullName, pullRequest.prNumber);

  return Response.json({ files }, { headers: { "Cache-Control": "no-store" } });
}
