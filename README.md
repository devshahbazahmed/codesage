# CodeSage

CodeSage is an AI-assisted pull request reviewer. It receives GitHub pull request webhooks, saves review state in PostgreSQL, runs review jobs with Inngest, and posts generated feedback back to GitHub.

## Features

- GitHub App integration for repository access and pull request webhooks.
- AI reviews generated with OpenRouter, with repository context indexed in Pinecone.
- Review status and comments persisted in PostgreSQL.
- Dashboard overview with pull request counts and recent activity from PostgreSQL. The overview refreshes every five seconds.
- Pull request workspace with saved review data and the current GitHub diff.
- Repository sync and subscription billing integrations.

## Tech Stack

- Next.js 16, React 19, and TypeScript
- PostgreSQL and Prisma 7
- Better Auth with GitHub OAuth
- Octokit and GitHub Apps
- Inngest for background jobs
- OpenRouter and Pinecone for AI review and code context
- Tailwind CSS 4

## Requirements

- Node.js supported by Next.js 16
- pnpm 12 (the package manager declared by this repository)
- A PostgreSQL database

GitHub App, OpenRouter, and Pinecone credentials are needed for end-to-end reviews. Razorpay credentials are only needed for billing features.

## Local Setup

1. Install dependencies:

   ```sh
   pnpm install
   ```

2. Create a `.env` file in the project root and set the values listed below. `.env` files are git-ignored.

3. Apply database migrations and generate the Prisma client:

   ```sh
   pnpm exec prisma migrate dev
   pnpm exec prisma generate
   ```

4. Start the application:

   ```sh
   pnpm dev
   ```

   Open [http://localhost:3000](http://localhost:3000).

5. To process background review jobs locally, run the Inngest Dev Server in another terminal:

   ```sh
   npx inngest-cli@latest dev
   ```

   The app exposes its Inngest functions at `/api/inngest`.

For local GitHub webhooks, configure the GitHub App webhook URL to a public HTTPS tunnel pointing to `/api/github/webhook`, and enable the `pull_request` event.

## Environment Variables

| Variable                 | Purpose                                                       |
| ------------------------ | ------------------------------------------------------------- |
| `DATABASE_URL`           | PostgreSQL connection string                                  |
| `BETTER_AUTH_URL`        | Base URL of this app, such as `http://localhost:3000`         |
| `GITHUB_CLIENT_ID`       | GitHub OAuth application client ID                            |
| `GITHUB_CLIENT_SECRET`   | GitHub OAuth application client secret                        |
| `GITHUB_APP_ID`          | GitHub App ID                                                 |
| `GITHUB_APP_PRIVATE_KEY` | GitHub App private key; preserve newlines or use `\n` escapes |
| `GITHUB_WEBHOOK_SECRET`  | Secret configured for the GitHub App webhook                  |
| `GITHUB_APP_NAME`        | GitHub App slug used to build the installation URL            |
| `OPENROUTER_API_KEY`     | API key used to generate reviews                              |
| `PINECONE_API_KEY`       | Pinecone API key                                              |
| `PINECONE_INDEX`         | Pinecone index name                                           |

Optional billing variables:

- `NEXT_PUBLIC_RAZORPAY_KEY_ID`
- `RAZORPAY_KEY_SECRET`
- `RAZORPAY_PLAN_ID`
- `RAZORPAY_WEBHOOK_SECRET`

## Pull Request Flow

1. GitHub sends an `opened`, `synchronize`, or `reopened` pull request event to `/api/github/webhook`.
2. CodeSage verifies the webhook signature and stores the pull request in PostgreSQL.
3. Inngest processes the review, retrieves changed files through the GitHub App, and uses Pinecone for repository context.
4. OpenRouter generates the review. CodeSage posts it to the pull request and saves its status and review text in PostgreSQL.
5. The dashboard reads data scoped to the signed-in user's GitHub App installation. The Overview polls for database updates every five seconds.

## Useful Commands

```sh
pnpm dev       # Start the development server
pnpm lint      # Run ESLint
pnpm build     # Build for production
pnpm start     # Start the production server
```

## Main Routes

- `/dashboard` - Overview metrics and recent pull requests
- `/dashboard/pull-request` - Pull request review workspace
- `/dashboard/repos` - Repositories available to the GitHub App
- `/dashboard/github` - GitHub App connection settings
