import React from "react";
import { requireAuth } from "@/features/auth/actions";
import DashboardHeader from "@/features/dashboard/components/DashboardHeader";
import { getUserSettings } from "@/features/settings/server/get-settings";
import { SettingsContent } from "@/features/dashboard/components/SettingsContent";

export default async function DashboardSettingsPage() {
  const session = await requireAuth();
  const settings = await getUserSettings(session.user.id);
  return (
    <>
      <DashboardHeader title="Settings" description="Manage your profile and subscription." />
      <SettingsContent profile={settings.profile} subscription={settings.subscription} usage={settings.usage} />
    </>
  );
}
