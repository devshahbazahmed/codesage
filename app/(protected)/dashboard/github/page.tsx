import React from 'react';
import type { Metadata } from 'next';
import { requireAuth } from '@/features/auth/actions';
import { getInstallationStatus } from '@/features/github/server/installation';
import DashboardHeader from '@/features/dashboard/components/DashboardHeader';
import GithubConnectCard from '@/features/github/components/GithubConnectCard';

export const metadata: Metadata = {
  title: 'Github App - Dashboard',
};

export default async function DashboardGithubPage() {
  const session = await requireAuth();
  const installation = await getInstallationStatus(session.user.id);
  return (
    <>
      <DashboardHeader
        title="Github App"
        description="Install or disconnect the reviewer app on your Github account"
      />
      <GithubConnectCard userId={session.user.id} installation={installation} />
    </>
  );
}
