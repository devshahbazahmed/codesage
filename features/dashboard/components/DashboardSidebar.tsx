import Link from 'next/link';
import React from 'react';
import { UserMenuUser } from '@/features/auth/components/UserMenu';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import Logo from '@/components/Logo';
import { DASHBOARD_ROUTES } from '../lib/routes';
import DashboardNav from './DashboardNav';
import SidebarUserButton from './SidebarUserButton';

export default function DashboardSidebar({
  user,
  plan = 'Pro',
}: {
  user: UserMenuUser;
  plan?: string;
}) {
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="flex items-center gap-2 group-data-[collapsible=icon]:justify-center">
          <SidebarMenu className="min-w-0 flex-1 group-data-[collapsible=icon]:hidden">
            <SidebarMenuItem>
              <SidebarMenuButton asChild size="lg" tooltip="CodeSage">
                <Link href={DASHBOARD_ROUTES.overview}>
                  <Logo />
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
          <SidebarTrigger className="ml-auto group-data-[collapsible=icon]:mx-0" />
        </div>
      </SidebarHeader>

      <SidebarContent>
        <DashboardNav />
      </SidebarContent>

      <SidebarFooter>
        <SidebarSeparator />
        <SidebarUserButton user={user} plan={plan} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
