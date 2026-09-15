import React from 'react';
import { UserMenuUser } from '@/features/auth/components/UserMenu';
import { TooltipProvider } from '@/components/ui/tooltip';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import DashboardSidebar from './DashboardSidebar';

type DashboardShellProps = {
  children: React.ReactNode;
  user: UserMenuUser;
  plan?: string;
};

export default function DashboardShell({
  children,
  user,
  plan = 'Free',
}: DashboardShellProps) {
  return (
    <TooltipProvider>
      <SidebarProvider className="[--background:#160f12] [--foreground:#f4e8ec] [--sidebar:#160f12] [--sidebar-accent:#2b2024] [--sidebar-accent-foreground:#f4e8ec] [--sidebar-border:#3b252d] [--sidebar-foreground:#d7c8ce] [--sidebar-primary:#ff5a00] [--sidebar-primary-foreground:#ff5a00]">
        <DashboardSidebar user={user} plan={plan} />
        <SidebarInset className="min-h-svh bg-background text-foreground">
          {children}
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  );
}
