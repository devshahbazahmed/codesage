import { UsageSummary } from "@/features/billing/server/usage";
import { UserSubscriptionState } from "@/features/dashboard/lib/types";

export type SettingsProfile = {
  name: string;
  email: string;
  image: string | null;
  memberSince: string;
};

export type UserSettings = {
  profile: SettingsProfile;
  subscription: UserSubscriptionState;
  usage: UsageSummary;
};
