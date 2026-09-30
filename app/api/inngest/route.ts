import { serve } from "inngest/next";
import { inngest } from "@/features/inngest/client";
import { processTask } from "./function";
import { reviewPullRequest } from "@/features/reviews/server/reviewPrFunction";
import { syncRepoCodebaseFunction } from "@/features/repo-sync/server/repo-sync-function";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [processTask, reviewPullRequest, syncRepoCodebaseFunction],
});
