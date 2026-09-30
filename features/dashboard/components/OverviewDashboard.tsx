"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { Activity, CheckCircle2, Clock3, GitPullRequest, LoaderCircle } from "lucide-react";
import { GithubIcon } from "@/features/auth/components/SocialLoginButton";
import type { DashboardOverview } from "@/features/dashboard/lib/overview-types";
import { DASHBOARD_ROUTES } from "@/features/dashboard/lib/routes";

type OverviewDashboardProps = {
  userName: string;
  initialOverview: DashboardOverview | null;
  isGithubConnected: boolean;
};

async function getOverview(): Promise<DashboardOverview | null> {
  const response = await fetch("/api/dashboard/overview", { cache: "no-store" });
  if (!response.ok) throw new Error("Could not load dashboard data");
  const result = (await response.json()) as { overview: DashboardOverview | null };
  return result.overview;
}

function statusLabel(status: string) {
  switch (status) {
    case "pending":
      return "Pending review";
    case "processing":
      return "Reviewing";
    case "reviewed":
      return "Reviewed";
    case "rate_limited":
      return "Limit reached";
    default:
      return status;
  }
}

function statusStyle(status: string) {
  switch (status) {
    case "reviewed":
      return "border-emerald-900 bg-emerald-950/60 text-emerald-300";
    case "processing":
      return "border-orange-900 bg-orange-950/50 text-orange-300";
    case "rate_limited":
      return "border-red-900 bg-red-950/50 text-red-300";
    default:
      return "border-amber-900 bg-amber-950/40 text-amber-300";
  }
}

export default function OverviewDashboard({ userName, initialOverview, isGithubConnected }: OverviewDashboardProps) {
  const overviewQuery = useQuery({
    queryKey: ["dashboard", "overview"],
    queryFn: getOverview,
    initialData: initialOverview,
    enabled: isGithubConnected,
    refetchInterval: 5_000,
  });
  const overview = overviewQuery.data;
  const firstName = userName.trim().split(/\s+/)[0] || "there";

  return (
    <main className="min-h-svh bg-[#1b171a] px-4 py-6 text-[#f5edf0] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <header className="flex flex-wrap items-end justify-between gap-4 border-b border-[#34272d] pb-5">
          <div>
            <p className="mb-1 flex items-center gap-2 text-[10px] font-semibold tracking-[0.12em] text-[#df8248] uppercase">
              <Activity className="size-3.5" />
              Workspace Overview
            </p>
            <h1 className="text-2xl font-semibold">Good morning, {firstName}</h1>
            <p className="mt-1 text-sm text-[#a9959d]">Your pull request activity, straight from the database.</p>
          </div>
          <p className="text-xs text-[#8e7d84]">
            {overviewQuery.isFetching ? "Updating..." : "Live updates every 5 seconds"}
          </p>
        </header>

        {!isGithubConnected ? (
          <section className="flex flex-col items-start gap-3 rounded-md border border-[#3a2f34] bg-[#211b1f] p-5 sm:flex-row sm:items-center">
            <span className="grid size-10 place-items-center rounded border border-[#49342d] bg-[#2a201d] text-[#f0a048]">
              <GithubIcon className="size-5" />
            </span>
            <div className="flex-1">
              <h2 className="text-sm font-semibold">Connect GitHub to get started</h2>
              <p className="mt-1 text-xs text-[#a9959d]">
                Pull request activity will appear here after the GitHub App is installed.
              </p>
            </div>
            <Link
              href={DASHBOARD_ROUTES.github}
              className="rounded bg-[#ff5a00] px-3 py-2 text-xs font-semibold text-white hover:bg-[#ff7133]"
            >
              Connect GitHub
            </Link>
          </section>
        ) : (
          <>
            {overviewQuery.isError && (
              <p
                role="status"
                className="rounded border border-[#704524] bg-[#342619] px-3 py-2 text-xs text-[#f0a24b]"
              >
                Could not refresh data. Showing the latest saved snapshot.
              </p>
            )}
            <section className="grid gap-3 sm:grid-cols-3">
              <StatCard
                label="Pull requests"
                value={overview?.stats.totalPullRequests ?? 0}
                icon={<GitPullRequest className="size-4" />}
              />
              <StatCard
                label="Awaiting review"
                value={overview?.stats.awaitingReview ?? 0}
                icon={<Clock3 className="size-4" />}
                tone="orange"
              />
              <StatCard
                label="Reviewed"
                value={overview?.stats.reviewed ?? 0}
                icon={<CheckCircle2 className="size-4" />}
                tone="green"
              />
            </section>

            <section className="overflow-hidden rounded-md border border-[#3a2f34] bg-[#211b1f]">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#392f34] px-4 py-3">
                <div>
                  <h2 className="text-sm font-semibold">Recent pull requests</h2>
                  <p className="mt-0.5 text-[11px] text-[#8e7d84]">
                    Latest webhook records for your GitHub installation
                  </p>
                </div>
                <Link
                  href={DASHBOARD_ROUTES.pullRequest}
                  className="text-xs font-medium text-[#f08a4e] hover:text-[#ffad7d]"
                >
                  Open review workspace
                </Link>
              </div>

              {!overview || overview.recentPullRequests.length === 0 ? (
                <div className="px-4 py-12 text-center">
                  {overviewQuery.isLoading ? (
                    <LoaderCircle className="mx-auto size-5 animate-spin text-[#e98a4d]" />
                  ) : (
                    <GitPullRequest className="mx-auto size-5 text-[#8e7d84]" />
                  )}
                  <p className="mt-3 text-sm font-medium">
                    {overviewQuery.isLoading ? "Loading pull requests" : "No pull requests yet"}
                  </p>
                  <p className="mt-1 text-xs text-[#8e7d84]">
                    New pull requests will show here when GitHub sends a webhook.
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-[#342b30]">
                  {overview.recentPullRequests.map((pullRequest) => (
                    <Link
                      key={pullRequest.id}
                      href={DASHBOARD_ROUTES.pullRequest}
                      className="flex flex-col gap-3 px-4 py-3 transition-colors hover:bg-[#292226] sm:flex-row sm:items-center"
                    >
                      <span className="grid size-8 shrink-0 place-items-center rounded border border-[#483338] bg-[#2b2025] text-[#f0784c]">
                        <GitPullRequest className="size-4" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-medium text-[#eee3e7]">
                          #{pullRequest.prNumber} {pullRequest.title}
                        </span>
                        <span className="mt-1 block text-[11px] text-[#9d8b93]">
                          {pullRequest.repoFullName} <span className="px-1">·</span>{" "}
                          {pullRequest.authorLogin ?? "Unknown author"}
                        </span>
                      </span>
                      <span className="flex items-center gap-3 sm:justify-end">
                        <span className={`rounded border px-2 py-1 text-[10px] ${statusStyle(pullRequest.status)}`}>
                          {statusLabel(pullRequest.status)}
                        </span>
                        <time className="w-24 text-right text-[10px] text-[#8e7d84]">
                          {new Date(pullRequest.updatedAt).toLocaleDateString()}
                        </time>
                      </span>
                    </Link>
                  ))}
                </div>
              )}
            </section>
          </>
        )}

        <p className="text-right text-[10px] text-[#786970]">
          {overviewQuery.dataUpdatedAt
            ? `Database updated ${new Date(overviewQuery.dataUpdatedAt).toLocaleTimeString()}`
            : "Waiting for database data"}
        </p>
      </div>
    </main>
  );
}

function StatCard({
  label,
  value,
  icon,
  tone = "neutral",
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
  tone?: "neutral" | "orange" | "green";
}) {
  const iconTone = tone === "orange" ? "text-[#f08a4e]" : tone === "green" ? "text-emerald-400" : "text-[#b8a5ad]";

  return (
    <article className="rounded-md border border-[#3a2f34] bg-[#211b1f] p-4">
      <div className="flex items-center justify-between text-xs text-[#a9959d]">
        <span>{label}</span>
        <span className={iconTone}>{icon}</span>
      </div>
      <p className="mt-3 text-2xl font-semibold tabular-nums">{value}</p>
    </article>
  );
}
