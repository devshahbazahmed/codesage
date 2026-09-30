import { getServerSession } from "@/features/auth/actions";
import { getUserInstallationId } from "@/features/github/server/installation";
import { getDashboardPullRequests } from "@/features/dashboard/server/pull-requests";

export async function GET() {
  const session = await getServerSession();

  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const installationId = await getUserInstallationId(session.user.id);

  if (!installationId) {
    return Response.json({ error: "GitHub App not connected" }, { status: 400 });
  }

  const pullRequests = await getDashboardPullRequests(installationId);

  return Response.json({ pullRequests }, { headers: { "Cache-Control": "no-store" } });
}
