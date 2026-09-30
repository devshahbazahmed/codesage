import React from "react";
import { UserMenuUser } from "@/features/auth/components/UserMenu";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import DashboardSidebar from "./DashboardSidebar";

type DashboardShellProps = {
  children: React.ReactNode;
  user: UserMenuUser;
  plan?: string;
};

export default function DashboardShell({ children, user, plan = "Free" }: DashboardShellProps) {
  return (
    <TooltipProvider>
      <SidebarProvider className="[--accent-foreground:#f5edf0] [--accent:#2b2024] [--background:#1b171a] [--border:#3a2f34] [--card-foreground:#f5edf0] [--card:#211b1f] [--foreground:#f5edf0] [--input:#3a2f34] [--muted-foreground:#a9959d] [--muted:#292226] [--popover-foreground:#f5edf0] [--popover:#211b1f] [--primary-foreground:#ffffff] [--primary:#ff5a00] [--ring:#ff7133] [--secondary-foreground:#f5edf0] [--secondary:#2b2024] [--sidebar-accent-foreground:#f4e8ec] [--sidebar-accent:#2b2024] [--sidebar-border:#3b252d] [--sidebar-foreground:#d7c8ce] [--sidebar-primary-foreground:#ffffff] [--sidebar-primary:#ff5a00] [--sidebar:#160f12]">
        <DashboardSidebar user={user} plan={plan} />
        <SidebarInset className="bg-background text-foreground min-h-svh">{children}</SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  );
}
