import { CodeChunk } from "@/features/reviews/types/review";
import { RepoFile } from "../types";
import { getGithubApp } from "@/features/github/utils/github-app";
import { getPineconeIndex } from "@/features/pinecone/client";
import { prisma } from "@/lib/db";
import { inngest } from "@/features/inngest/client";

const MAX_FILE_SIZE_BYTES = 100_000;
const MAX_FILES = 200;
const MAX_CHUNK_LINES = 80;
const MAX_BATCH_TOKENS = 20_000;
const MAX_BATCH_RECORDS = 20;

const RATE_LIMIT_DELAY_MS = 1_000;
const MAX_RETRIES = 5;

function estimateTokens(text: string) {
  // Rough estimation:
  // ~4 characters per token for typical source code.
  return Math.ceil(text.length / 4);
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function upsertWithRetry(
  namespace: string,
  records: Array<{
    id: string;
    text: string;
    filePath: string;
  }>
) {
  const index = getPineconeIndex();

  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      await index.namespace(namespace).upsertRecords({
        records,
      });

      return;
    } catch (error: any) {
      const status = error?.status ?? error?.response?.status ?? error?.cause?.status;

      if (status !== 429 || attempt === MAX_RETRIES - 1) {
        throw error;
      }

      const delay = Math.min(2 ** attempt * 2_000, 30_000);

      console.warn(`Pinecone rate limit reached. Retrying in ${delay}ms...`);

      await sleep(delay);
    }
  }
}

const CODE_EXTENSIONS = [
  ".ts",
  ".tsx",
  ".js",
  ".jsx",
  ".mjs",
  ".py",
  ".go",
  ".rb",
  ".rs",
  ".java",
  ".kt",
  ".swift",
  ".c",
  ".h",
  ".cpp",
  ".php",
  ".cs",
  ".sql",
  ".prisma",
  ".css",
  ".md",
  ".yml",
  ".yaml",
];

const SKIPPED_FOLDERS = ["node_modules/", "dist/", "build/", ".next/", "generated/", "vendor/"];

type TreeEntry = {
  path?: string;
  type?: string;
  sha?: string;
  size?: number;
};

export function buildRepoNameSpace(repoFullName: string) {
  return `${repoFullName.replace("/", "--")}--codebase`;
}

function hasCodeExtension(path: string) {
  return CODE_EXTENSIONS.some((extension) => path.endsWith(extension));
}

function isSkippedPath(path: string) {
  return SKIPPED_FOLDERS.some((folder) => path.includes(folder));
}

function isIndexableFile(entry: TreeEntry) {
  if (entry.type !== "blob" || !entry.path || !entry.sha) {
    return false;
  }

  if (entry.size && entry.size > MAX_FILE_SIZE_BYTES) {
    return false;
  }

  if (isSkippedPath(entry.path)) {
    return false;
  }

  return hasCodeExtension(entry.path);
}

function buildChunkId(filePath: string, part: number) {
  return `repo--${filePath}--part-${part}`;
}

export function chunkRepoFiles(files: RepoFile[]): CodeChunk[] {
  const chunks: CodeChunk[] = [];

  for (const file of files) {
    const lines = file.content.split("\n");

    for (let start = 0; start < lines.length; start += MAX_CHUNK_LINES) {
      const part = start / MAX_CHUNK_LINES;
      const text = lines.slice(start, start + MAX_CHUNK_LINES).join("\n");

      chunks.push({
        id: buildChunkId(file.filePath, part),
        filePath: file.filePath,
        text,
      });
    }
  }

  return chunks;
}

export async function getRepoFiles(installationId: number, repoFullName: string, branch: string): Promise<RepoFile[]> {
  const app = getGithubApp();
  const octokit = await app.getInstallationOctokit(installationId);
  const [owner, repo] = repoFullName.split("/");

  const { data: tree } = await octokit.request("GET /repos/{owner}/{repo}/git/trees/{tree_sha}", {
    owner,
    repo,
    tree_sha: branch,
    recursive: "1",
  });

  const entries = tree.tree.filter(isIndexableFile).slice(0, MAX_FILES);
  const files: RepoFile[] = [];

  for (const entry of entries) {
    const { data: blob } = await octokit.request("GET /repos/{owner}/{repo}/git/blobs/{file_sha}", {
      owner,
      repo,
      file_sha: entry.sha!,
    });

    const content = Buffer.from(blob.content, "base64").toString("utf-8");
    files.push({ filePath: entry.path!, content });
  }

  return files;
}

export async function deleteRepoNamespace(namespace: string) {
  const index = getPineconeIndex();
  await index.deleteNamespace(namespace);
}

export async function saveRepoChunks(namespace: string, chunks: CodeChunk[]) {
  let batch: Array<{
    id: string;
    text: string;
    filePath: string;
  }> = [];

  let batchTokens = 0;

  for (const chunk of chunks) {
    const record = {
      id: chunk.id,
      text: chunk.text,
      filePath: chunk.filePath,
    };

    const estimatedTokens = estimateTokens(chunk.text);

    const wouldExceedTokenLimit = batchTokens + estimatedTokens > MAX_BATCH_TOKENS;

    const wouldExceedRecordLimit = batch.length >= MAX_BATCH_RECORDS;

    if (batch.length > 0 && (wouldExceedTokenLimit || wouldExceedRecordLimit)) {
      await upsertWithRetry(namespace, batch);

      batch = [];
      batchTokens = 0;

      await sleep(RATE_LIMIT_DELAY_MS);
    }

    batch.push(record);
    batchTokens += estimatedTokens;
  }

  if (batch.length > 0) {
    await upsertWithRetry(namespace, batch);
  }
}

export async function getRepoSyncStatuses(repoFullNames: string[]) {
  const syncs = await prisma.repoSync.findMany({
    where: { repoFullName: { in: repoFullNames } },
    select: { repoFullName: true, status: true },
  });

  const statusByRepo: Record<string, string> = {};

  for (const sync of syncs) {
    statusByRepo[sync.repoFullName] = sync.status;
  }

  return statusByRepo;
}

export async function triggerRepoSync(installationId: number, repoFullName: string, branch: string) {
  const repoSync = await prisma.repoSync.upsert({
    where: { repoFullName },
    create: { installationId, repoFullName, branch, status: "pending" },
    update: { installationId, branch, status: "pending" },
  });

  await inngest.send({
    name: "repo/sync.requested",
    data: { repoSyncId: repoSync.id },
  });
}
