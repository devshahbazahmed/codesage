"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronDown,
  CircleCheck,
  Code2,
  GitBranch,
  GitPullRequest,
  LockKeyhole,
  ScanSearch,
  ShieldAlert,
  Sparkles,
  Workflow,
} from "lucide-react";

const featureItems = [
  {
    icon: GitPullRequest,
    accent: "text-[#ff8752] bg-[#3a211b] border-[#653020]",
    eyebrow: "01 / REVIEW",
    title: "Reviews that know the repository",
    description:
      "Each pull request is reviewed alongside relevant code from your repository, so feedback has context beyond the diff.",
    code: "context = changed_code + repository_knowledge",
  },
  {
    icon: ShieldAlert,
    accent: "text-[#ff6f68] bg-[#351d22] border-[#622d34]",
    eyebrow: "02 / SECURITY",
    title: "Security issues, called out clearly",
    description: "Surface risky changes and receive actionable explanations directly in your pull request review.",
    code: "auth · secrets · unsafe input · dependencies",
  },
  {
    icon: ScanSearch,
    accent: "text-[#e7ad4b] bg-[#32291b] border-[#5c4827]",
    eyebrow: "03 / CONTEXT",
    title: "Useful signal, less review noise",
    description:
      "CodeSage processes pull request changes and related repository context before generating concise feedback.",
    code: "diff → retrieve context → review → GitHub",
  },
  {
    icon: LockKeyhole,
    accent: "text-[#55d5a6] bg-[#193027] border-[#285340]",
    eyebrow: "04 / CONTROL",
    title: "Your code stays in your workflow",
    description: "Connect a GitHub App installation and keep review activity scoped to the repositories you selected.",
    code: "private repositories supported on Pro",
  },
];

const workflowSteps = [
  {
    number: "01",
    title: "Connect GitHub",
    description: "Install the CodeSage GitHub App for your account or organization.",
  },
  {
    number: "02",
    title: "Open a pull request",
    description: "CodeSage receives the pull request event and starts a background review.",
  },
  {
    number: "03",
    title: "Review the findings",
    description: "Read the generated review in GitHub and follow its status in your dashboard.",
  },
];

const faqs = [
  {
    question: "Does CodeSage train on my source code?",
    answer:
      "CodeSage uses repository context to produce reviews. Configure your GitHub App and AI provider credentials according to your organization's data policies.",
  },
  {
    question: "Which GitHub events start a review?",
    answer:
      "The current integration reviews pull requests when they are opened, reopened, or updated with new commits.",
  },
  {
    question: "What is included in the Free plan?",
    answer:
      "The Free plan includes up to 10 AI reviews per month on public repositories. Pro supports unlimited reviews on connected public and private repositories.",
  },
  {
    question: "Where do I see review progress?",
    answer:
      "Review comments are posted to GitHub. The CodeSage dashboard also shows pull request status and refreshes its overview automatically.",
  },
];

function reveal(reducedMotion: boolean, delay = 0) {
  return {
    initial: { opacity: 0, y: reducedMotion ? 0 : 18 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.16 },
    transition: { duration: reducedMotion ? 0 : 0.56, delay: reducedMotion ? 0 : delay, ease: "easeOut" as const },
  };
}

export default function LandingPage() {
  const reducedMotion = useReducedMotion() ?? false;

  return (
    <main className="min-h-svh overflow-hidden bg-[#171316] text-[#f4edf0]">
      <div className="border-b border-[#392c31] bg-[#211b1f] px-4 py-2 text-center text-[10px] text-[#c8b7be] sm:text-[11px]">
        <span className="mr-2 inline-block size-1.5 rounded-full bg-[#ff7133] align-middle" />
        Repository-aware AI reviews are now available for connected GitHub repositories.
        <a
          href="#how-it-works"
          className="ml-2 inline-flex items-center gap-1 font-medium text-[#ff9669] hover:text-white"
        >
          See how it works <ArrowRight className="size-3" />
        </a>
      </div>

      <header className="sticky top-0 z-30 border-b border-[#34272d] bg-[#171316]/95 backdrop-blur">
        <nav
          aria-label="Main navigation"
          className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-5 px-4 sm:px-6 lg:px-8"
        >
          <a href="#top" className="flex shrink-0 items-center gap-2.5" aria-label="CodeSage home">
            <span className="grid size-8 place-items-center rounded border border-[#62321f] bg-[#352219] text-[#ff7c38]">
              <Code2 className="size-4" />
            </span>
            <span className="text-[15px] font-semibold text-white">
              Code<span className="text-[#ff7133]">Sage</span>
            </span>
          </a>
          <div className="hidden items-center gap-6 text-[11px] text-[#b7a8ae] md:flex">
            <a className="transition-colors hover:text-white" href="#product">
              Product
            </a>
            <a className="transition-colors hover:text-white" href="#features">
              Features
            </a>
            <a className="transition-colors hover:text-white" href="#how-it-works">
              How it works
            </a>
            <a className="transition-colors hover:text-white" href="#plans">
              Plans
            </a>
            <a className="transition-colors hover:text-white" href="#faq">
              FAQ
            </a>
          </div>
          <div className="flex shrink-0 items-center gap-2.5">
            <Link href="/sign-in" className="px-2 py-2 text-[11px] text-[#d4c7cc] transition-colors hover:text-white">
              Sign in
            </Link>
            <Link
              href="/sign-in"
              className="inline-flex h-8 items-center gap-1.5 rounded bg-[#ff5a00] px-3 text-[10px] font-semibold text-white transition-colors hover:bg-[#ff7133]"
            >
              Start reviewing <ArrowUpRight className="size-3.5" />
            </Link>
          </div>
        </nav>
      </header>

      <section id="top" className="relative px-4 pt-14 pb-12 sm:px-6 sm:pt-20 lg:px-8 lg:pt-24 lg:pb-16">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-1/2 h-115 w-[min(960px,100vw)] -translate-x-1/2 bg-[radial-gradient(ellipse_at_center,rgba(255,91,25,0.12),transparent_67%)]" />
          <div className="absolute inset-x-0 top-0 h-130 bg-[linear-gradient(rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.06)_1px,transparent_1px)] mask-[linear-gradient(to_bottom,black,transparent)] bg-size-[44px_44px] opacity-[0.13]" />
        </div>

        <div className="relative mx-auto max-w-5xl text-center">
          <motion.div
            initial={{ opacity: 0, y: reducedMotion ? 0 : 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reducedMotion ? 0 : 0.45 }}
            className="mx-auto inline-flex items-center gap-2 rounded-full border border-[#5a3526] bg-[#2d201a] px-3 py-1.5 text-[10px] font-medium text-[#f1aa7c]"
          >
            <Sparkles className="size-3 text-[#ff7838]" />
            AI code review, built around your repository
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: reducedMotion ? 0 : 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reducedMotion ? 0 : 0.56, delay: reducedMotion ? 0 : 0.08 }}
            className="mx-auto mt-6 max-w-4xl text-[38px] leading-[1.06] font-semibold sm:text-[52px] lg:text-[64px]"
          >
            Ship better code.
            <br className="hidden sm:block" />
            <span className="text-[#ff7133]">Keep your reviews moving.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: reducedMotion ? 0 : 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reducedMotion ? 0 : 0.5, delay: reducedMotion ? 0 : 0.18 }}
            className="mx-auto mt-5 max-w-2xl text-[14px] leading-6 text-[#b6a7ad] sm:text-[15px]"
          >
            CodeSage reviews pull requests with relevant repository context, flags risky changes, and posts actionable
            feedback directly to GitHub.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: reducedMotion ? 0 : 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reducedMotion ? 0 : 0.45, delay: reducedMotion ? 0 : 0.26 }}
            className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row"
          >
            <Link
              href="/sign-in"
              className="inline-flex h-11 items-center justify-center gap-2 rounded bg-[#ff5a00] px-5 text-xs font-semibold text-white shadow-[0_8px_30px_rgba(255,90,0,0.16)] transition hover:bg-[#ff7133]"
            >
              Start reviewing for free <ArrowRight className="size-4" />
            </Link>
            <a
              href="#product"
              className="inline-flex h-11 items-center justify-center gap-2 rounded border border-[#49383f] bg-[#211b1f] px-5 text-xs font-medium text-[#e4d8dd] transition hover:border-[#704332] hover:bg-[#292226]"
            >
              Explore a review <ArrowDownRight className="size-4 text-[#e8915c]" />
            </a>
          </motion.div>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[9px] text-[#9b8991]">
            <span className="inline-flex items-center gap-1.5">
              <Check className="size-3 text-[#57d29e]" />
              10 reviews each month on Free
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Check className="size-3 text-[#57d29e]" />
              GitHub App integration
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Check className="size-3 text-[#57d29e]" />
              No code changes required
            </span>
          </div>
        </div>

        <motion.div
          id="product"
          initial={{ opacity: 0, y: reducedMotion ? 0 : 26, scale: reducedMotion ? 1 : 0.985 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: reducedMotion ? 0 : 0.7, delay: reducedMotion ? 0 : 0.34, ease: "easeOut" }}
          className="relative mx-auto mt-12 max-w-5xl scroll-mt-24"
        >
          <div className="absolute -inset-4 -z-10 rounded-[18px] bg-[radial-gradient(ellipse_at_center,rgba(255,92,30,0.15),transparent_68%)] blur-xl" />
          <div className="overflow-hidden rounded-lg border border-[#56332a] bg-[#201a1d] shadow-[0_28px_100px_rgba(0,0,0,0.45)]">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#392d32] bg-[#191518] px-3 py-2.5 sm:px-4">
              <div className="flex min-w-0 items-center gap-2 text-[10px] text-[#b8a8af]">
                <span className="flex gap-1.5">
                  <span className="size-2 rounded-full bg-[#ff6259]" />
                  <span className="size-2 rounded-full bg-[#e8ad45]" />
                  <span className="size-2 rounded-full bg-[#36bb82]" />
                </span>
                <span className="hidden text-[#63545a] sm:inline">/</span>
                <span className="truncate">acme / auth-service</span>
                <span className="hidden text-[#63545a] sm:inline">/</span>
                <span className="shrink-0 text-[#ed8b55]">PR #284</span>
                <span className="hidden rounded border border-[#604127] bg-[#34271c] px-1.5 py-0.5 text-[8px] text-[#e4b56e] sm:inline">
                  Example review
                </span>
              </div>
              <span className="inline-flex items-center gap-1.5 text-[9px] text-[#9b8b92]">
                <span className="size-1.5 animate-pulse rounded-full bg-[#48cf96]" />
                Review complete
              </span>
            </div>

            <div className="grid gap-px bg-[#35292e] sm:grid-cols-3">
              <div className="flex items-center gap-3 bg-[#241e22] px-3 py-3 sm:px-4">
                <span className="grid size-7 place-items-center rounded bg-[#193025] text-[#58d5a0]">
                  <CircleCheck className="size-4" />
                </span>
                <div>
                  <p className="text-[8px] tracking-[0.08em] text-[#8c7d83] uppercase">Review status</p>
                  <p className="mt-0.5 text-[10px] font-medium text-[#d9cdd2]">Review complete</p>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-[#241e22] px-3 py-3 sm:px-4">
                <span className="grid size-7 place-items-center rounded bg-[#381e22] text-[#ff7771]">
                  <ShieldAlert className="size-4" />
                </span>
                <div>
                  <p className="text-[8px] tracking-[0.08em] text-[#8c7d83] uppercase">Security insight</p>
                  <p className="mt-0.5 text-[10px] font-medium text-[#d9cdd2]">Unsafe token decode</p>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-[#241e22] px-3 py-3 sm:px-4">
                <span className="grid size-7 place-items-center rounded bg-[#30271a] text-[#e8b34d]">
                  <GitBranch className="size-4" />
                </span>
                <div>
                  <p className="text-[8px] tracking-[0.08em] text-[#8c7d83] uppercase">Repository context</p>
                  <p className="mt-0.5 text-[10px] font-medium text-[#d9cdd2]">Context included</p>
                </div>
              </div>
            </div>

            <div className="grid min-h-55 lg:grid-cols-[1fr_300px]">
              <div className="min-w-0 overflow-hidden">
                <div className="flex items-center justify-between border-b border-[#352a2f] px-3 py-2 text-[9px] text-[#a5949b] sm:px-4">
                  <span className="flex min-w-0 items-center gap-2">
                    <Code2 className="size-3.5 shrink-0 text-[#ef8247]" />
                    <span className="truncate">src/auth/validateToken.ts</span>
                  </span>
                  <span className="shrink-0">Unified diff</span>
                </div>
                <div className="overflow-x-auto py-2 font-mono text-[9px] leading-5">
                  <div className="grid min-w-140 grid-cols-[34px_34px_1fr] px-1 text-[#cbbcc2]">
                    <span className="pr-2 text-right text-[#75666d]">39</span>
                    <span className="pr-2 text-right text-[#75666d]">39</span>
                    <code className="px-2">export async function validateToken(token: string) &#123;</code>
                  </div>
                  <div className="grid min-w-140 grid-cols-[34px_34px_1fr] px-1 text-[#cbbcc2]">
                    <span className="pr-2 text-right text-[#75666d]">40</span>
                    <span className="pr-2 text-right text-[#75666d]">40</span>
                    <code className="px-2"> const [header, payload, signature] = token.split(&quot;.&quot;);</code>
                  </div>
                  <div className="grid min-w-140 grid-cols-[34px_34px_1fr] bg-[#3c2024] px-1 text-[#ffaaa1]">
                    <span className="pr-2 text-right text-[#e56e6a]">41</span>
                    <span className="pr-2 text-right text-[#e56e6a]">41</span>
                    <code className="px-2">− const claims = JSON.parse(atob(payload));</code>
                  </div>
                  <div className="grid min-w-140 grid-cols-[34px_34px_1fr] bg-[#193025] px-1 text-[#8ed7a9]">
                    <span className="pr-2 text-right text-[#718b79]"> </span>
                    <span className="pr-2 text-right text-[#718b79]">41</span>
                    <code className="px-2">+ const claims = await verifyAndDecode(token, secret);</code>
                  </div>
                  <div className="grid min-w-140 grid-cols-[34px_34px_1fr] px-1 text-[#cbbcc2]">
                    <span className="pr-2 text-right text-[#75666d]">42</span>
                    <span className="pr-2 text-right text-[#75666d]">42</span>
                    <code className="px-2"> return claims.exp &gt; Date.now() / 1000;</code>
                  </div>
                  <div className="grid min-w-140 grid-cols-[34px_34px_1fr] px-1 text-[#cbbcc2]">
                    <span className="pr-2 text-right text-[#75666d]">43</span>
                    <span className="pr-2 text-right text-[#75666d]">43</span>
                    <code className="px-2">&#125;</code>
                  </div>
                </div>
              </div>
              <div className="border-t border-[#352a2f] bg-[#211a1e] p-3 sm:p-4 lg:border-t-0 lg:border-l">
                <div className="flex items-start gap-2.5">
                  <span className="grid size-7 shrink-0 place-items-center rounded border border-[#773b3b] bg-[#3b2225] text-[#ff7972]">
                    <ShieldAlert className="size-4" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-[9px] font-semibold tracking-[0.08em] text-[#ff837a] uppercase">
                      Security finding
                    </p>
                    <h2 className="mt-1 text-[12px] leading-5 font-semibold text-[#f1e7ea]">
                      Verify the token before trusting its claims
                    </h2>
                  </div>
                </div>
                <p className="mt-3 text-[10px] leading-[1.7] text-[#b8a8ae]">
                  Decoding a JWT payload without verifying its signature can let an attacker supply forged claims.
                </p>
                <div className="mt-3 rounded border border-[#334b3d] bg-[#18251e] p-2.5">
                  <p className="text-[8px] font-semibold tracking-[0.08em] text-[#70c890] uppercase">
                    Suggested direction
                  </p>
                  <code className="mt-1.5 block font-mono text-[9px] leading-4 wrap-break-word text-[#abd4b6]">
                    verify signature → validate expiry → read claims
                  </code>
                </div>
                <p className="mt-3 text-[8px] text-[#82747a]">
                  Example interface preview. Findings depend on each pull request.
                </p>
              </div>
            </div>
          </div>
          <p className="mt-3 flex items-center justify-center gap-2 text-[9px] text-[#786970]">
            <span className="size-1 rounded-full bg-[#f08b4b]" />
            Review comments are posted on the pull request in GitHub
          </p>
        </motion.div>
      </section>

      <section id="features" className="scroll-mt-20 px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-6xl">
          <motion.div {...reveal(reducedMotion)} className="flex flex-col items-center justify-center text-center">
            <p className="text-center text-[10px] font-semibold tracking-[0.14em] text-[#f08a4e] uppercase">
              Review signal, not review noise
            </p>
            <h2 className="mt-3 text-3xl leading-tight font-semibold sm:text-4xl">
              A second set of eyes for every pull request.
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-6 text-[#a9959d]">
              Find the changes worth discussing and give engineers useful context before code reaches production.
            </p>
          </motion.div>
          <div className="mt-9 grid gap-3 sm:grid-cols-2">
            {featureItems.map(({ icon: Icon, accent, eyebrow, title, description, code }, index) => (
              <motion.article
                key={title}
                {...reveal(reducedMotion, index * 0.06)}
                className="group rounded-md border border-[#3a2f34] bg-[#211b1f] p-5 transition-colors hover:border-[#64402f] sm:p-6"
              >
                <div className="flex items-start justify-between">
                  <span className={`grid size-9 place-items-center rounded border ${accent}`}>
                    <Icon className="size-4" />
                  </span>
                  <span className="font-mono text-[9px] text-[#776870]">{eyebrow}</span>
                </div>
                <h3 className="mt-5 text-[16px] font-semibold">{title}</h3>
                <p className="mt-2 max-w-lg text-[12px] leading-5 text-[#a9959d]">{description}</p>
                <div className="mt-5 overflow-hidden rounded border border-[#342a2f] bg-[#181417] px-3 py-2.5 font-mono text-[9px] text-[#ae9791]">
                  <span className="mr-2 text-[#eb8350]">›</span>
                  {code}
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section
        id="how-it-works"
        className="scroll-mt-20 border-y border-[#34272d] bg-[#201a1e] px-4 py-20 sm:px-6 lg:px-8 lg:py-24"
      >
        <div className="mx-auto max-w-6xl">
          <motion.div {...reveal(reducedMotion)} className="mx-auto max-w-2xl text-center">
            <p className="text-[10px] font-semibold tracking-[0.14em] text-[#f08a4e] uppercase">
              From pull request to perspective
            </p>
            <h2 className="mt-3 text-3xl font-semibold sm:text-4xl">Your workflow stays yours.</h2>
            <p className="mt-3 text-sm leading-6 text-[#a9959d]">
              Connect once. Reviews arrive where your team already works.
            </p>
          </motion.div>
          <div className="mt-10 grid gap-3 md:grid-cols-3">
            {workflowSteps.map((step, index) => (
              <motion.div
                key={step.number}
                {...reveal(reducedMotion, index * 0.08)}
                className="relative rounded-md border border-[#3a2f34] bg-[#1b171a] p-5"
              >
                <span className="font-mono text-[10px] text-[#f08a4e]">STEP {step.number}</span>
                {index === 0 ? (
                  <GitBranch className="mt-5 size-5 text-[#ce8960]" />
                ) : index === 1 ? (
                  <GitPullRequest className="mt-5 size-5 text-[#ce8960]" />
                ) : (
                  <Sparkles className="mt-5 size-5 text-[#ce8960]" />
                )}
                <h3 className="mt-4 text-sm font-semibold">{step.title}</h3>
                <p className="mt-2 text-[11px] leading-5 text-[#a9959d]">{step.description}</p>
                {index < workflowSteps.length - 1 && (
                  <ArrowRight
                    aria-hidden="true"
                    className="absolute top-6 right-5 hidden size-4 text-[#65565d] md:block"
                  />
                )}
              </motion.div>
            ))}
          </div>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 rounded border border-[#3a2f34] bg-[#211b1f] px-4 py-3 text-[10px] text-[#a9959d]">
            <span className="inline-flex items-center gap-2">
              <Workflow className="size-3.5 text-[#ef8b50]" />
              Background review processing
            </span>
            <span className="inline-flex items-center gap-2">
              <CircleCheck className="size-3.5 text-[#54d0a0]" />
              Review state in your dashboard
            </span>
            <span className="inline-flex items-center gap-2">
              <GitPullRequest className="size-3.5 text-[#d8956d]" />
              Comments delivered to GitHub
            </span>
          </div>
        </div>
      </section>

      <section id="plans" className="scroll-mt-20 px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-5xl">
          <motion.div {...reveal(reducedMotion)} className="mx-auto max-w-2xl text-center">
            <p className="text-[10px] font-semibold tracking-[0.14em] text-[#f08a4e] uppercase">
              Start small. Scale when ready.
            </p>
            <h2 className="mt-3 text-3xl font-semibold sm:text-4xl">A plan for your codebase.</h2>
            <p className="mt-3 text-sm leading-6 text-[#a9959d]">
              Try CodeSage on public repositories, then add private repository support when your team needs it.
            </p>
          </motion.div>
          <div className="mx-auto mt-9 grid max-w-3xl gap-4 md:grid-cols-2">
            <motion.article {...reveal(reducedMotion)} className="rounded-md border border-[#3a2f34] bg-[#211b1f] p-6">
              <p className="text-[10px] font-semibold tracking-[0.12em] text-[#cfbfc6] uppercase">Free</p>
              <p className="mt-4 text-3xl font-semibold">
                $0 <span className="text-xs font-normal text-[#8f8086]">/ month</span>
              </p>
              <p className="mt-2 text-xs text-[#a9959d]">For open source and getting started.</p>
              <ul className="mt-6 space-y-3 text-xs text-[#c8b9bf]">
                <li className="flex gap-2">
                  <Check className="size-4 text-[#55d5a6]" />
                  Up to 10 AI reviews per month
                </li>
                <li className="flex gap-2">
                  <Check className="size-4 text-[#55d5a6]" />
                  Public repositories
                </li>
                <li className="flex gap-2">
                  <Check className="size-4 text-[#55d5a6]" />
                  GitHub App integration
                </li>
              </ul>
              <Link
                href="/sign-in"
                className="mt-7 inline-flex h-10 w-full items-center justify-center rounded border border-[#514047] text-xs font-semibold text-[#eee2e7] transition hover:bg-[#30262b]"
              >
                Start for free
              </Link>
            </motion.article>
            <motion.article
              {...reveal(reducedMotion, 0.08)}
              className="relative rounded-md border border-[#b55021] bg-[#241c1b] p-6 shadow-[0_0_35px_rgba(255,90,0,0.07)]"
            >
              <span className="absolute -top-2.5 right-5 rounded bg-[#ff5a00] px-2 py-1 text-[8px] font-semibold tracking-[0.08em] text-white uppercase">
                Private repositories
              </span>
              <p className="text-[10px] font-semibold tracking-[0.12em] text-[#f08a4e] uppercase">Pro</p>
              <p className="mt-4 text-3xl font-semibold">
                Pro <span className="text-xs font-normal text-[#8f8086]">plan</span>
              </p>
              <p className="mt-2 text-xs text-[#a9959d]">For teams reviewing private and public code.</p>
              <ul className="mt-6 space-y-3 text-xs text-[#c8b9bf]">
                <li className="flex gap-2">
                  <Check className="size-4 text-[#55d5a6]" />
                  Unlimited AI reviews on connected repositories
                </li>
                <li className="flex gap-2">
                  <Check className="size-4 text-[#55d5a6]" />
                  Public and private repository support
                </li>
                <li className="flex gap-2">
                  <Check className="size-4 text-[#55d5a6]" />
                  Priority support
                </li>
              </ul>
              <Link
                href="/sign-in"
                className="mt-7 inline-flex h-10 w-full items-center justify-center gap-2 rounded bg-[#ff5a00] text-xs font-semibold text-white transition hover:bg-[#ff7133]"
              >
                Get started <ArrowRight className="size-3.5" />
              </Link>
            </motion.article>
          </div>
          <p className="mt-4 text-center text-[10px] text-[#807178]">
            Pro pricing is shown in the billing portal after sign-in.
          </p>
        </div>
      </section>

      <section
        id="faq"
        className="scroll-mt-20 border-t border-[#34272d] bg-[#201a1e] px-4 py-20 sm:px-6 lg:px-8 lg:py-24"
      >
        <div className="mx-auto max-w-3xl">
          <motion.div {...reveal(reducedMotion)} className="mb-7 text-center">
            <p className="text-[10px] font-semibold tracking-[0.14em] text-[#f08a4e] uppercase">Questions, answered</p>
            <h2 className="mt-3 text-3xl font-semibold">Before your next review.</h2>
          </motion.div>
          <div className="space-y-2">
            {faqs.map((faq, index) => (
              <motion.details
                key={faq.question}
                {...reveal(reducedMotion, index * 0.04)}
                className="group rounded border border-[#3a2f34] bg-[#211b1f] px-4 open:border-[#614130]"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 text-xs font-medium text-[#e9dfe3]">
                  {faq.question}
                  <ChevronDown className="size-4 shrink-0 text-[#9c858f] transition-transform group-open:rotate-180" />
                </summary>
                <p className="max-w-2xl pr-8 pb-4 text-[11px] leading-5 text-[#a9959d]">{faq.answer}</p>
              </motion.details>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-12 sm:px-6 lg:px-8">
        <motion.div
          {...reveal(reducedMotion)}
          className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 rounded-md border border-[#593728] bg-[#241c1b] px-6 py-8 sm:flex-row sm:items-center sm:px-9"
        >
          <div>
            <p className="text-[9px] font-semibold tracking-[0.14em] text-[#f08a4e] uppercase">
              Give every pull request a closer look
            </p>
            <h2 className="mt-2 text-2xl font-semibold">Make the next review count.</h2>
            <p className="mt-2 max-w-xl text-xs leading-5 text-[#ad9ba2]">
              Connect GitHub and let CodeSage take the first pass at your changes.
            </p>
          </div>
          <Link
            href="/sign-in"
            className="inline-flex h-10 shrink-0 items-center gap-2 rounded bg-[#ff5a00] px-4 text-xs font-semibold text-white transition hover:bg-[#ff7133]"
          >
            Start reviewing <ArrowRight className="size-4" />
          </Link>
        </motion.div>
      </section>

      <footer className="border-t border-[#34272d] bg-[#141114] px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 text-[10px] text-[#897980] sm:flex-row sm:items-center sm:justify-between">
          <a href="#top" className="flex items-center gap-2 font-semibold text-[#eee4e8]">
            <span className="grid size-6 place-items-center rounded border border-[#62321f] bg-[#352219] text-[#ff7c38]">
              <Code2 className="size-3.5" />
            </span>
            CodeSage
          </a>
          <p>AI-assisted pull request reviews for teams that care about the details.</p>
          <div className="flex items-center gap-4">
            <Link href="/sign-in" className="hover:text-white">
              Sign in
            </Link>
            <a href="#features" className="hover:text-white">
              Features
            </a>
            <a href="#faq" className="hover:text-white">
              FAQ
            </a>
            <a href="#top" className="hover:text-white">
              Back to top
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}
