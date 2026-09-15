import React from 'react';
import { requireAuth } from '@/features/auth/actions';
import DashboardShell from '@/features/dashboard/components/DashboardShell';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireAuth();
  return (
    <DashboardShell user={session.user} plan="Pro">
      {children}
    </DashboardShell>
  );
}
