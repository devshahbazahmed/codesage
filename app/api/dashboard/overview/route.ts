import { getServerSession } from "@/features/auth/actions";
import { getUserInstallationId } from "@/features/github/server/installation";
import { getDashboardOverview } from "@/features/dashboard/server/overview";

export async function GET() {
  const session = await getServerSession();

  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const installationId = await getUserInstallationId(session.user.id);
  const overview = installationId ? await getDashboardOverview(installationId) : null;

  return Response.json({ overview }, { headers: { "Cache-Control": "no-store" } });
}
