import { prisma } from "@/lib/db";
import { inngest } from "@/features/inngest/client";
import { chunkPrFiles } from "@/features/reviews/utils/chunkCode";
import { postPrComment } from "@/features/reviews/server/PostPrComment";
import { getPullRequestFiles } from "@/features/reviews/server/prFiles";
import { buildPrNameSpace, saveChunksToPinecone, searchPrContext } from "./vector";
import { buildRepoNameSpace } from "@/features/repo-sync/server/repo-sync";
import { generateReview } from "./generateReview";

export const reviewPullRequest = inngest.createFunction(
  {
    id: "review-pull-request",
    triggers: {
      event: "github/pr.received",
    },
  },
  async ({ event, step }) => {
    const pullRequestId = event.data.pullRequestId;

    const pullRequest = await step.run("mark-processing", () => {
      return prisma.pullRequest.update({
        where: {
          id: pullRequestId,
        },
        data: {
          status: "processing",
        },
      });
    });

    const chunks = await step.run("breakdown-code", async () => {
      const files = await getPullRequestFiles(
        pullRequest.installationId,
        pullRequest.repoFullName,
        pullRequest.prNumber
      );

      // Turn unified diffs into fixed-size chunks for embedding
      return chunkPrFiles(pullRequest.prNumber, files);
    });

    if (chunks.length === 0) {
      await step.run("mark-reviewed-no-code", async () => {
        await prisma.pullRequest.update({
          where: { id: pullRequestId },
          data: { status: "reviewed" },
        });
      });

      return { pullRequestId, status: "reviewed", reason: "No code to review" };
    }

    // PR namespace isolates this diff from other PR's and from repo-wide sync data
    const namespace = buildPrNameSpace(pullRequest.repoFullName, pullRequest.prNumber);

    await step.run("save-vectors-to-pinecone", async () => {
      await saveChunksToPinecone(namespace, chunks);
    });

    // Pincecone needs a short delay before new vectors appear in search results
    await step.sleep("wait-for-vectors-to-index", "10s");

    // Extra context from the on-demand codebase sync, when the repo was synced
    const repoContextSnippets = await step.run("search-repo-context", async () => {
      const repoSync = await prisma.repoSync.findUnique({
        where: { repoFullName: pullRequest.repoFullName },
      });

      if (!repoSync || repoSync.status !== "synced") {
        return [];
      }

      const repoNameSpace = buildRepoNameSpace(pullRequest.repoFullName);
      return searchPrContext(repoNameSpace, pullRequest.title);
    });

    const review = await step.run("generate-ai-review", async () => {
      // Search within the PR's namespace for chunks related to the PR title
      const contextSnippets = await searchPrContext(namespace, pullRequest.title);

      return generateReview({
        repoFullName: pullRequest.repoFullName,
        title: pullRequest.title,
        contextSnippets,
        repoContextSnippets,
      });
    });

    await step.run("post-pr-comment", async () => {
      await postPrComment(pullRequest.installationId, pullRequest.repoFullName, pullRequest.prNumber, review);
    });

    await step.run("mark-reviewed", async () => {
      await prisma.pullRequest.update({
        where: { id: pullRequestId },
        data: {
          status: "reviewed",
          reviewComment: review,
          reviewedAt: new Date(),
        },
      });
    });

    return { pullRequestId, status: "reviewed" };
  }
);
