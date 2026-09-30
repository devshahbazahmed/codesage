import type { Metadata } from "next";
import { requireAuth } from "@/features/auth/actions";
import { getUserInstallationId } from "@/features/github/server/installation";
import { getDashboardOverview } from "@/features/dashboard/server/overview";
import OverviewDashboard from "@/features/dashboard/components/OverviewDashboard";

export const metadata: Metadata = {
  title: "Overview - Dashboard",
};

export default async function DashboardPage() {
  const session = await requireAuth();
  const installationId = await getUserInstallationId(session.user.id);
  const overview = installationId ? await getDashboardOverview(installationId) : null;

  return (
    <OverviewDashboard
      userName={session.user.name}
      initialOverview={overview}
      isGithubConnected={Boolean(installationId)}
    />
  );
}
