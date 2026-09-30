"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Bell,
  CheckCircle2,
  Clock3,
  ExternalLink,
  FileCode2,
  FileDiff,
  GitBranch,
  GitPullRequest,
  LoaderCircle,
  Search,
  ShieldAlert,
  Sparkles,
} from "lucide-react";
import type {
  DashboardPullRequest,
  DashboardPullRequestDetail,
  DashboardPullRequestFile,
} from "@/features/dashboard/lib/pull-request-types";

type PullRequestReviewPageProps = {
  initialPullRequests: DashboardPullRequest[];
  isGithubConnected: boolean;
};

type DiffLine = {
  oldNumber: number | "";
  newNumber: number | "";
  text: string;
  kind: "added" | "removed" | "context" | "hunk";
};

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url, { cache: "no-store" });
  const body = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(body.error ?? "Failed to load pull request data");
  }

  return body as T;
}

function parseUnifiedDiff(patch: string): DiffLine[] {
  let oldNumber = 0;
  let newNumber = 0;

  return patch.split("\n").map((text) => {
    const hunk = text.match(/^@@ -(\d+)(?:,\d+)? \+(\d+)(?:,\d+)? @@/);
    if (hunk) {
      oldNumber = Number(hunk[1]);
      newNumber = Number(hunk[2]);
      return { oldNumber: "", newNumber: "", text, kind: "hunk" };
    }

    if (text.startsWith("+++ ") || text.startsWith("--- ")) {
      return { oldNumber: "", newNumber: "", text, kind: "hunk" };
    }
    if (text.startsWith("+")) {
      return { oldNumber: "", newNumber: newNumber++, text, kind: "added" };
    }
    if (text.startsWith("-")) {
      return { oldNumber: oldNumber++, newNumber: "", text, kind: "removed" };
    }
    if (text.startsWith("\\")) {
      return { oldNumber: "", newNumber: "", text, kind: "context" };
    }

    return { oldNumber: oldNumber++, newNumber: newNumber++, text, kind: "context" };
  });
}

function getStatusLabel(status: string) {
  switch (status) {
    case "pending":
      return "Pending Review";
    case "processing":
      return "Review In Progress";
    case "reviewed":
      return "Review Complete";
    case "rate_limited":
      return "Review Limit Reached";
    default:
      return status;
  }
}

export default function PullRequestReviewPage({ initialPullRequests, isGithubConnected }: PullRequestReviewPageProps) {
  const pullRequestsQuery = useQuery({
    queryKey: ["dashboard", "pull-requests"],
    queryFn: () => fetchJson<{ pullRequests: DashboardPullRequest[] }>("/api/github/pull-requests"),
    initialData: { pullRequests: initialPullRequests },
    enabled: isGithubConnected,
    refetchInterval: 5_000,
  });
  const pullRequests = pullRequestsQuery.data.pullRequests;
  const [selectedPullRequestId, setSelectedPullRequestId] = useState(initialPullRequests[0]?.id ?? "");
  const [activeFile, setActiveFile] = useState(0);
  const [activeTab, setActiveTab] = useState("Files Changed");
  const selectedPullRequest = pullRequests.find(({ id }) => id === selectedPullRequestId) ?? pullRequests[0] ?? null;
  const selectedId = selectedPullRequest?.id ?? "";

  const detailQuery = useQuery({
    queryKey: ["dashboard", "pull-request", selectedId],
    queryFn: () => fetchJson<{ pullRequest: DashboardPullRequestDetail }>(`/api/github/pull-requests/${selectedId}`),
    enabled: selectedId.length > 0,
    refetchInterval: 5_000,
  });
  const filesQuery = useQuery({
    queryKey: ["dashboard", "pull-request-files", selectedId, selectedPullRequest?.headSha],
    queryFn: () => fetchJson<{ files: DashboardPullRequestFile[] }>(`/api/github/pull-requests/${selectedId}/files`),
    enabled: selectedId.length > 0,
    staleTime: 60_000,
  });

  const reviewPullRequest = detailQuery.data?.pullRequest ?? null;
  const files = filesQuery.data?.files ?? [];
  const selectedFile = files[activeFile] ?? null;
  const diffLines = selectedFile ? parseUnifiedDiff(selectedFile.patch) : [];
  const status = reviewPullRequest?.status ?? selectedPullRequest?.status ?? "pending";
  const statusLabel = getStatusLabel(status);
  const additions = files.reduce((total, file) => total + file.additions, 0);
  const deletions = files.reduce((total, file) => total + file.deletions, 0);
  const reviewSummary = reviewPullRequest?.reviewComment
    ?.split(/\r?\n/)
    .find((line) => line.trim() && !line.trim().startsWith("#"))
    ?.replace(/[*`_]/g, "");

  return (
    <main className="min-h-svh bg-[#1b171a] text-[#f5edf0]">
      <div className="flex h-12 items-center gap-3 border-b border-[#34272d] bg-[#171316] px-4 sm:px-6">
        <div className="flex min-w-0 items-center gap-2 text-[11px] text-[#aa989f]">
          <span className="hidden sm:inline">CodeSage</span>
          <span className="hidden text-[#65565d] sm:inline">/</span>
          <span className="hidden sm:inline">Pull Requests</span>
          <span className="text-[#65565d]">/</span>
          <select
            aria-label="Select a pull request"
            value={selectedId}
            onChange={(event) => {
              setSelectedPullRequestId(event.target.value);
              setActiveFile(0);
            }}
            disabled={pullRequests.length === 0}
            className="max-w-56 truncate bg-transparent font-semibold text-[#ff7133] outline-none disabled:opacity-60"
          >
            {pullRequests.length === 0 ? (
              <option value="">No pull requests</option>
            ) : (
              pullRequests.map((pullRequest) => (
                <option key={pullRequest.id} value={pullRequest.id}>
                  {pullRequest.repoFullName} #{pullRequest.prNumber} · {pullRequest.title}
                </option>
              ))
            )}
          </select>
        </div>
        <label className="ml-auto hidden h-8 max-w-sm flex-1 items-center gap-2 rounded border border-[#3a2d33] bg-[#211b1f] px-2.5 text-[11px] text-[#9e8e95] md:flex">
          <Search className="size-3.5" />
          <input
            aria-label="Search reviews, files, and commits"
            placeholder="Search reviews, files, commits..."
            className="min-w-0 flex-1 bg-transparent text-[#f5edf0] outline-none placeholder:text-[#776970]"
          />
          <kbd className="rounded border border-[#49383f] px-1 py-0.5 text-[9px]">⌘K</kbd>
        </label>
        {isGithubConnected && (
          <span className="hidden items-center gap-1.5 rounded border border-[#433027] bg-[#261d19] px-2 py-1 text-[10px] text-[#e6a26c] sm:flex">
            <span className="size-1.5 rounded-full bg-[#ff8a3d]" />
            GitHub Connected
          </span>
        )}
        <button
          type="button"
          aria-label="Notifications"
          className="relative grid size-8 place-items-center rounded text-[#b7a8ae] hover:bg-[#2b2227]"
        >
          <Bell className="size-4" />
        </button>
      </div>

      {!isGithubConnected || pullRequests.length === 0 ? (
        <div className="flex min-h-[55vh] flex-col items-center justify-center gap-3 px-6 text-center">
          <GitPullRequest className="size-8 text-[#d27b45]" />
          <h1 className="text-base font-semibold">
            {!isGithubConnected ? "Connect GitHub to view pull requests" : "No pull requests yet"}
          </h1>
          <p className="max-w-md text-xs leading-5 text-[#aa9aa1]">
            {!isGithubConnected
              ? "Install the GitHub App to receive pull request events and review data."
              : "Pull requests will appear here when the GitHub App receives a pull_request webhook."}
          </p>
          {pullRequestsQuery.isError && (
            <p role="alert" className="text-xs text-[#ff8c87]">
              Could not refresh pull requests from the database.
            </p>
          )}
        </div>
      ) : (
        <>
          <section className="border-b border-[#34272d] bg-[#211b1f] px-4 pt-4 pb-0 sm:px-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="flex min-w-0 gap-3">
                <div className="mt-0.5 grid size-9 shrink-0 place-items-center rounded border border-[#5a2729] bg-[#351b20] text-[#ff5c4a]">
                  <GitPullRequest className="size-4" />
                </div>
                <div className="min-w-0">
                  <h1 className="max-w-3xl text-[16px] leading-6 font-semibold sm:text-[18px]">
                    PR #{selectedPullRequest?.prNumber}: {selectedPullRequest?.title}
                  </h1>
                  <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-[10px] text-[#ab9ba1]">
                    <span className="rounded-full border border-[#6d2a2d] bg-[#3a1e22] px-2 py-0.5 font-medium text-[#ff8278]">
                      ● {statusLabel}
                    </span>
                    <span>
                      Author:{" "}
                      <strong className="font-medium text-[#d8cbd0]">
                        {selectedPullRequest?.authorLogin ?? "Unknown"}
                      </strong>
                    </span>
                    <span>·</span>
                    <span>
                      Repository: <code className="text-[#dfa079]">{selectedPullRequest?.repoFullName}</code>
                    </span>
                    <span>into</span>
                    <code className="text-[#d8cbd0]">{selectedPullRequest?.baseBranch}</code>
                    <span className="hidden sm:inline">· {files.length} files</span>
                    <span className="text-emerald-400">+{additions}</span>
                    <span className="text-rose-400">−{deletions}</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-1.5 sm:ml-auto">
                <span className="flex h-8 items-center gap-1.5 rounded border border-[#4b3925] bg-[#29221c] px-2.5 text-[10px] font-medium text-[#f2a64a]">
                  <Sparkles className="size-3.5" />
                  AI Review · {statusLabel}
                </span>
                <a
                  href={`https://github.com/${selectedPullRequest?.repoFullName}/pull/${selectedPullRequest?.prNumber}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex h-8 items-center gap-1.5 rounded border border-[#40343a] px-2.5 text-[10px] text-[#d7c8ce] hover:bg-[#30262c]"
                >
                  <ExternalLink className="size-3.5" />
                  Open on GitHub
                </a>
              </div>
            </div>
          </section>

          <div className="space-y-3 p-3 sm:p-4 sm:px-6">
            {pullRequestsQuery.isError && (
              <p
                role="status"
                className="rounded border border-[#704524] bg-[#342619] px-3 py-2 text-xs text-[#f0a24b]"
              >
                Live refresh failed. Showing the last data received from the database.
              </p>
            )}
            <section className="flex flex-wrap items-center gap-x-4 gap-y-2 rounded-md border border-[#3b3035] bg-[#272125] px-3 py-2.5 sm:px-4">
              <div className="grid size-11 shrink-0 place-items-center rounded-full border-4 border-[#b86a32] text-[#f2a35c]">
                {status === "reviewed" ? (
                  <CheckCircle2 className="size-5" />
                ) : status === "processing" ? (
                  <LoaderCircle className="size-5 animate-spin" />
                ) : (
                  <Clock3 className="size-5" />
                )}
              </div>
              <div className="min-w-45 flex-1">
                <div className="mb-1 flex flex-wrap items-center gap-2">
                  <span className="rounded border border-[#694223] bg-[#39281b] px-1.5 py-0.5 text-[9px] font-semibold text-[#f0a048]">
                    CodeSage AI Review
                  </span>
                  <span className="rounded border border-[#49383f] bg-[#30262b] px-1.5 py-0.5 text-[9px] font-medium text-[#d7c8ce]">
                    {statusLabel}
                  </span>
                </div>
                <p className="text-[11px] leading-[1.55] text-[#e7dce0]">
                  <strong className="font-semibold text-white">
                    {reviewSummary ? "Saved review:" : "Review status:"}
                  </strong>{" "}
                  {reviewSummary ??
                    (status === "processing"
                      ? "The review is processing. This view updates automatically."
                      : status === "reviewed"
                        ? "The review completed without a saved comment."
                        : status === "rate_limited"
                          ? "The account reached its review limit."
                          : "The pull request is waiting for its automated review.")}
                </p>
              </div>
              <div className="ml-auto flex shrink-0 items-center gap-1.5">
                <span className="flex items-center gap-1.5 rounded border border-[#3b3035] bg-[#211b1f] px-2 py-2 text-[#d0bec6]">
                  <FileDiff className="size-3.5" />
                  <span className="text-[9px] font-semibold">{files.length} FILES</span>
                </span>
              </div>
            </section>

            <section className="grid min-w-0 gap-3 xl:grid-cols-[205px_minmax(0,1fr)_248px]">
              <aside className="min-w-0 space-y-3">
                <div className="overflow-hidden rounded-md border border-[#3a2f34] bg-[#211b1f]">
                  <div className="flex h-10 items-center justify-between border-b border-[#392f34] px-3">
                    <h2 className="flex items-center gap-1.5 text-[11px] font-semibold">
                      <FileDiff className="size-3.5 text-[#c6b5bc]" />
                      Changed Files ({files.length})
                    </h2>
                    <span className="text-[9px] text-[#8e7e85]">GitHub</span>
                  </div>
                  <div className="max-h-80 space-y-0.5 overflow-auto p-1.5">
                    {filesQuery.isPending && (
                      <p className="px-2 py-3 text-[9px] text-[#a9959d]">Loading changed files...</p>
                    )}
                    {filesQuery.isError && (
                      <p className="px-2 py-3 text-[9px] text-[#ff8c87]">Could not load GitHub files.</p>
                    )}
                    {!filesQuery.isPending && !filesQuery.isError && files.length === 0 && (
                      <p className="px-2 py-3 text-[9px] text-[#a9959d]">No patch files are available.</p>
                    )}
                    {files.map((file, index) => (
                      <button
                        key={file.filePath}
                        type="button"
                        onClick={() => setActiveFile(index)}
                        className={`w-full rounded px-2 py-2 text-left transition-colors ${activeFile === index ? "bg-[#30252a]" : "hover:bg-[#2a2226]"}`}
                      >
                        <span className="flex items-start gap-2">
                          <FileCode2 className="mt-0.5 size-3 shrink-0 text-[#d6a16e]" />
                          <span className="min-w-0 flex-1">
                            <span className="block text-[9px] leading-4 break-all text-[#e2d5da]">{file.filePath}</span>
                            <span className="mt-0.5 block text-[9px] text-[#a9959d]">
                              {file.status} · {file.changes} changed lines
                            </span>
                          </span>
                          <span className="shrink-0 text-[9px] text-[#77ce9e]">
                            +{file.additions} −{file.deletions}
                          </span>
                        </span>
                      </button>
                    ))}
                  </div>
                  <div className="border-t border-[#392f34] px-3 py-2.5">
                    <h3 className="mb-1 text-[9px] font-semibold tracking-[0.08em] text-[#9e8e95] uppercase">
                      Review Status
                    </h3>
                    <p className="text-[9px] text-[#cbbdc2]">{statusLabel}</p>
                  </div>
                </div>
                <div className="rounded-md border border-[#493225] bg-[#261f1b] p-3">
                  <div className="mb-1.5 flex items-center gap-1.5 text-[10px] font-semibold text-[#efa348]">
                    <Clock3 className="size-3.5" />
                    Database Update
                  </div>
                  <p className="text-[10px] leading-[1.55] text-[#cdbfc1]">
                    {selectedPullRequest ? new Date(selectedPullRequest.updatedAt).toLocaleString() : "—"}
                  </p>
                  <p className="mt-1 text-[9px] text-[#8e7e85]">Refreshes automatically every 5 seconds</p>
                </div>
              </aside>

              <div className="min-w-0 overflow-hidden rounded-md border border-[#3a2f34] bg-[#1d191c]">
                <div className="flex min-h-10 flex-wrap items-center justify-between gap-2 border-b border-[#392f34] bg-[#241e22] px-3 py-2">
                  <div className="flex min-w-0 items-center gap-2 text-[10px]">
                    <FileCode2 className="size-3.5 shrink-0 text-[#ff6a18]" />
                    <span className="truncate font-medium text-[#e8dce1]">
                      {selectedFile?.filePath ?? "Select a changed file"}
                    </span>
                    <span className="hidden rounded bg-[#342a30] px-1.5 py-0.5 text-[9px] text-[#c5b5bd] sm:inline">
                      {selectedFile?.filePath.split(".").pop()?.toUpperCase() ?? "DIFF"}
                    </span>
                  </div>
                  <span className="rounded bg-[#382f34] px-2 py-1 text-[9px] text-white">Unified diff</span>
                </div>
                <div className="overflow-x-auto">
                  <div className="min-w-147.5 font-mono text-[9px] leading-5.5 text-[#c8bbc0]">
                    {diffLines.map((line, index) => (
                      <div
                        key={`${line.oldNumber}-${line.newNumber}-${index}`}
                        className={`grid grid-cols-[30px_30px_1fr] ${line.kind === "added" ? "bg-[#172a22]" : line.kind === "removed" ? "bg-[#381d22]" : line.kind === "hunk" ? "bg-[#252c3a]" : ""}`}
                      >
                        <span className="border-r border-[#332a2e] pr-2 text-right text-[#786970] select-none">
                          {line.oldNumber}
                        </span>
                        <span className="border-r border-[#332a2e] pr-2 text-right text-[#786970] select-none">
                          {line.newNumber}
                        </span>
                        <code
                          className={`px-3 whitespace-pre ${line.kind === "added" ? "text-[#8ed5a7]" : line.kind === "removed" ? "text-[#ff9991]" : line.kind === "hunk" ? "text-[#aebee3]" : "text-[#d2c5cb]"}`}
                        >
                          {line.text}
                        </code>
                      </div>
                    ))}
                    {filesQuery.isPending && diffLines.length === 0 && (
                      <p className="px-3 py-4 text-[10px] text-[#a9959d]">Loading GitHub diff...</p>
                    )}
                    {filesQuery.isError && diffLines.length === 0 && (
                      <p className="px-3 py-4 text-[10px] text-[#ff8c87]">GitHub diff could not be loaded.</p>
                    )}
                    {!filesQuery.isPending && !filesQuery.isError && diffLines.length === 0 && (
                      <p className="px-3 py-4 text-[10px] text-[#a9959d]">No diff lines are available for this file.</p>
                    )}
                  </div>
                </div>
                <section className="m-3 rounded-md border border-[#3a2f34] bg-[#241e22]">
                  <div className="flex items-center gap-2 border-b border-[#3a2f34] px-3 py-2.5">
                    <Sparkles className="size-3.5 text-[#f0a048]" />
                    <h3 className="text-[10px] font-semibold">Saved AI Review</h3>
                    {reviewPullRequest?.reviewedAt && (
                      <time className="ml-auto text-[9px] text-[#9e8e95]">
                        {new Date(reviewPullRequest.reviewedAt).toLocaleString()}
                      </time>
                    )}
                  </div>
                  {detailQuery.isError ? (
                    <p className="px-3 py-3 text-[10px] text-[#ff8c87]">Could not load the saved review.</p>
                  ) : detailQuery.isPending ? (
                    <p className="px-3 py-3 text-[10px] text-[#a9959d]">Loading saved review...</p>
                  ) : reviewPullRequest?.reviewComment ? (
                    <pre className="max-h-105 overflow-auto p-3 font-sans text-[10px] leading-5 whitespace-pre-wrap text-[#ddd0d5]">
                      {reviewPullRequest.reviewComment}
                    </pre>
                  ) : (
                    <p className="px-3 py-3 text-[10px] text-[#a9959d]">
                      {statusLabel}. The saved review will appear here when available.
                    </p>
                  )}
                </section>
                <div className="flex items-center justify-between border-t border-[#342b30] px-3 py-2 text-[9px] text-[#8f7f87]">
                  <span>{selectedFile?.changes ?? 0} changed lines</span>
                  <span className="flex items-center gap-1">
                    <GitBranch className="size-3" />
                    {reviewPullRequest?.headSha.slice(0, 7) ?? selectedPullRequest?.headSha.slice(0, 7)}
                  </span>
                </div>
              </div>

              <aside className="min-w-0 space-y-3">
                <section className="overflow-hidden rounded-md border border-[#49342d] bg-[#211b1f]">
                  <div className="flex items-center gap-2 border-b border-[#3b2e32] px-3 py-2.5">
                    <span className="grid size-7 place-items-center rounded bg-[#f05b26] text-white">
                      <Sparkles className="size-4" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <h2 className="text-[11px] font-semibold">Review Data</h2>
                      <p className="flex items-center gap-1 text-[9px] text-[#ec9d69]">
                        <span className="size-1 rounded-full bg-[#ffa044]" />
                        Live database polling
                      </p>
                    </div>
                  </div>
                  <div className="space-y-3 p-3 text-[10px]">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[#a9959d]">Review state</span>
                      <span className="text-[#e7dce0]">{statusLabel}</span>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[#a9959d]">Updated</span>
                      <time className="text-right text-[#e7dce0]">
                        {selectedPullRequest ? new Date(selectedPullRequest.updatedAt).toLocaleString() : "—"}
                      </time>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[#a9959d]">Head commit</span>
                      <code className="text-[#dfa079]">{selectedPullRequest?.headSha.slice(0, 7)}</code>
                    </div>
                    {reviewPullRequest?.reviewedAt && (
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[#a9959d]">Reviewed</span>
                        <time className="text-right text-[#e7dce0]">
                          {new Date(reviewPullRequest.reviewedAt).toLocaleString()}
                        </time>
                      </div>
                    )}
                  </div>
                </section>
                <div className="rounded-md border border-[#3b3035] bg-[#211b1f] px-3 py-2.5">
                  <p className="flex items-center gap-1.5 text-[10px] text-[#d6c6cc]">
                    <ShieldAlert className="size-3.5 text-[#f19045]" />
                    Protected by installation scope
                  </p>
                  <p className="mt-1 text-[9px] leading-4 text-[#8e7d84]">
                    PR records and diffs are only returned for your connected GitHub installation.
                  </p>
                </div>
              </aside>
            </section>
            <div className="flex flex-wrap items-center justify-between gap-2 px-1 pb-2 text-[9px] text-[#786970]">
              <span>Review record {selectedPullRequest?.id}</span>
              <span>
                {pullRequestsQuery.dataUpdatedAt
                  ? `Database refreshed ${new Date(pullRequestsQuery.dataUpdatedAt).toLocaleTimeString()}`
                  : "Waiting for database refresh"}
              </span>
            </div>
          </div>
        </>
      )}
    </main>
  );
}
