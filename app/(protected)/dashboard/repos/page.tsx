import type { Metadata } from "next";
import Link from "next/link";
import { requireAuth } from "@/features/auth/actions";
import { getInstallationStatus } from "@/features/github/server/installation";
import DashboardHeader from "@/features/dashboard/components/DashboardHeader";
import RepoList from "@/features/dashboard/components/RepoList";
import { Button } from "@/components/ui/button";
import { DASHBOARD_ROUTES } from "@/features/dashboard/lib/routes";

export const metadata: Metadata = {
  title: "Repositories - Dashboard",
};

function ReposNotConnected() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 p-6">
      <p className="text-muted-foreground text-sm">Install the Github App first to see your repositories.</p>
      <Link href={DASHBOARD_ROUTES.github}>
        <Button>Go to Github App</Button>
      </Link>
    </div>
  );
}

export default async function DashboardReposPage() {
  const session = await requireAuth();
  const installation = await getInstallationStatus(session.user.id);
  const header = (
    <DashboardHeader
      title="Repositories"
      description="All public and private repositories available to the Github App."
    />
  );

  if (!installation) {
    return (
      <>
        {header}
        <ReposNotConnected />
      </>
    );
  }
  return (
    <>
      {header}
      <RepoList />
    </>
  );
}
