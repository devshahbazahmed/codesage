'use client';
import React from 'react';
import {
  type UserMenuUser,
  UserMenu,
} from '@/features/auth/components/UserMenu';
import { SidebarMenu, SidebarMenuItem } from '@/components/ui/sidebar';

type SidebarMenuProps = {
  user: UserMenuUser;
  plan?: string;
};

export default function SidebarUserButton({ user, plan }: SidebarMenuProps) {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <UserMenu
          user={user}
          plan={plan}
          variant="profile"
          className="w-full rounded-md border border-sidebar-border bg-sidebar-accent text-sidebar-accent-foreground hover:bg-sidebar-accent/80 group-data-[collapsible=icon]:size-8 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:border-0 group-data-[collapsible=icon]:bg-transparent group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:[&>span]:hidden group-data-[collapsible=icon]:[&>svg]:hidden"
        />
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
