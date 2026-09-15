import type { Metadata } from 'next';
import GithubSignInForm from '@/features/auth/components/GithubSignInForm';

export const metadata: Metadata = {
  title: 'Sign In | CodeSage',
  description: 'Sign In to CodeSage AI Code Reviewer with your Github account',
};

type SignInPageProps = {
  searchParams: Promise<{ callbackUrl?: string }>;
};

const SignInPage = async ({ searchParams }: SignInPageProps) => {
  const { callbackUrl } = await searchParams;
  return (
    <div className="mx-auto flex w-full max-w-155 flex-col px-7 py-8 sm:px-12 lg:px-16 xl:px-20">
      {/* Form */}
      <div className="my-auto w-full py-12">
        <div className="mb-8">
          <h2 className="text-[30px] font-bold tracking-tight text-white">
            Welcome to Code<span className="text-primary">Sage</span>
          </h2>

          <p className="mt-3 max-w-117.5 text-[15px] leading-6 text-zinc-500">
            Enter your credentials or authenticate via your version control
            provider.
          </p>
        </div>

        {/* GitHub */}
        <GithubSignInForm callbackUrl={callbackUrl} />

        {/* Divider */}
        {/* <div className="my-8 flex items-center gap-4">
          <div className="h-px flex-1 bg-white/8" />

          <span className="font-mono text-[11px] uppercase tracking-widest text-zinc-600">
            or email
          </span>

          <div className="h-px flex-1 bg-white/8" />
        </div> */}

        {/* Email */}
        {/* <div className="space-y-2">
          <label
            htmlFor="email"
            className="text-[13px] font-medium text-zinc-300"
          >
            Work Email
          </label>

          <Input
            id="email"
            type="email"
            placeholder="you@company.com"
            defaultValue="shahbaz@acme.engineering"
            className="h-[51px] border-white/[0.09] bg-white/[0.02] px-4 text-[14px] text-zinc-200 placeholder:text-zinc-700 focus-visible:border-orange-500/60 focus-visible:ring-1 focus-visible:ring-orange-500/20"
          />
        </div> */}

        {/* Password */}
        {/* <div className="mt-5 space-y-2">
          <div className="flex items-center justify-between">
            <label
              htmlFor="password"
              className="text-[13px] font-medium text-zinc-300"
            >
              Password
            </label>

            <button className="text-[12px] font-medium text-orange-500 transition-colors hover:text-orange-400">
              Forgot password?
            </button>
          </div>

          <Input
            id="password"
            type="password"
            defaultValue="codesage-password"
            className="h-[51px] border-white/[0.09] bg-white/[0.02] px-4 text-[14px] text-zinc-200 focus-visible:border-orange-500/60 focus-visible:ring-1 focus-visible:ring-orange-500/20"
          />
        </div> */}

        {/* Submit */}
        {/* <Button className="mt-6 h-[51px] w-full bg-gradient-to-r from-orange-500 to-red-500 text-[14px] font-semibold text-white shadow-lg shadow-orange-950/20 transition-all hover:from-orange-400 hover:to-red-400">
          Sign In to Workspace
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button> */}
      </div>
    </div>
  );
};

export default SignInPage;
