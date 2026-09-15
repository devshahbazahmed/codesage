import React from 'react';
import { Sparkles } from 'lucide-react';
import Logo from '@/components/Logo';
import { requireUnAuth } from '@/features/auth/actions';

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireUnAuth();
  return (
    <main className="flex justify-center items-center min-h-screen bg-[#0b090a]">
      <section className="relative hidden min-h-screen overflow-hidden border-r border-white/8 lg:flex lg:w-[62%] lg:flex-col lg:justify-center lg:items-center">
        {/* Background glow */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-32 -top-32 h-130 w-130 rounded-full bg-orange-600/10 blur-[130px]" />
          <div className="absolute bottom-0 left-[30%] h-125 w-150 rounded-full bg-red-600/7 blur-[140px]" />
        </div>

        <div className="relative z-10 flex h-full flex-col px-10 py-5 xl:px-14">
          {/* Logo */}
          <div className="py-10 -mt-10">
            <Logo />
          </div>

          {/* Main content */}
          <div className="mx-auto flex w-full max-w-205 flex-col justify-center py-5">
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/6 px-3.5 py-2 text-[12px] font-medium text-orange-400">
              <Sparkles className="h-3.5 w-3.5" />
              Continuous Pull Request Security &amp; Architectural Audit
            </div>

            <h1 className="mt-7 max-w-180 text-4xl font-bold leading-[1.08] tracking-[-0.035em] text-white xl:text-[50px]">
              Ship cleaner code with an{' '}
              <span className="bg-linear-to-r from-orange-400 via-orange-500 to-red-500 bg-clip-text text-transparent">
                autonomous
              </span>{' '}
              reviewer by your side.
            </h1>

            <p className="mt-6 max-w-180 text-[16px] leading-7 text-zinc-500 xl:text-[17px]">
              Eliminate tedious boilerplate reviews. Catch memory leaks,
              bottlenecks, and critical security regressions right inside
              GitHub.
            </p>
          </div>
        </div>
      </section>
      <section className="flex min-h-screen flex-1 bg-[#0b090a] justify-center items-center">
        {children}
      </section>
    </main>
  );
}
