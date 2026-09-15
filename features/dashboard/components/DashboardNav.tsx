'use client';
import React from 'react';
import {
  FolderGit2Icon,
  LayoutDashboardIcon,
  SettingsIcon,
} from 'lucide-react';
import { GithubIcon } from '@/features/auth/components/SocialLoginButton';
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { DASHBOARD_NAV_ITEMS, DashboardRoute } from '../lib/routes';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

const NAV_ICONS = {
  'layout-dashboard': LayoutDashboardIcon,
  'folder-git-2': FolderGit2Icon,
  github: GithubIcon,
  settings: SettingsIcon,
} as const;

function isNavActive(pathname: string, href: DashboardRoute) {
  if (pathname === '/dashboard') {
    return pathname === href;
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function DashboardNav() {
  const pathname = usePathname();
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Workspace</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {DASHBOARD_NAV_ITEMS.map((item) => {
            const Icon = NAV_ICONS[item.icon];
            const active = isNavActive(pathname, item.href);

            return (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  asChild
                  isActive={active}
                  tooltip={item.title}
                  className={
                    active
                      ? 'relative !bg-sidebar-accent !text-sidebar-primary before:absolute before:inset-y-0 before:left-0 before:w-1 before:rounded-r-full before:bg-sidebar-primary hover:!bg-sidebar-accent hover:!text-sidebar-primary'
                      : 'hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                  }
                >
                  <Link
                    href={item.href}
                    className="flex items-center justify-start gap-2"
                  >
                    <Icon />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
