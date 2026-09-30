import { getGithubApp } from "@/features/github/utils/github-app";

export async function postPrComment(installationId: number, repoFullName: string, prNumber: number, body: string) {
  if (!body?.trim()) {
    throw new Error(`Cannot post PR comment: body is empty for ${repoFullName}#${prNumber}`);
  }
  const app = getGithubApp();
  const octokit = await app.getInstallationOctokit(installationId);
  const [owner, repo] = repoFullName.split("/");

  if (!owner || !repo) {
    throw new Error(`Invalid repository name: ${repoFullName}`);
  }

  await octokit.request("POST /repos/{owner}/{repo}/issues/{issue_number}/comments", {
    owner,
    repo,
    issue_number: prNumber,
    body: body.trim(),
  });
}
