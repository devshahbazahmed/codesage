/**  Whether a repository is visible to everyone or only to collaborators */
export type RepoVisibility = 'public' | 'private';

export type RepoSyncStatus = 'pending' | 'syncing' | 'synced' | 'failed';

/**
 * A repository row displayed in the Repositories table.
 * Fields mirror what the Github API returns, plus optional sync status.
 */
export type DashboardRepo = {
  id: string;
  name: string;
  fullName: string;
  visibility: RepoVisibility;
  defaultBranch: string;
  updatedAt: string;
  language: string | null;
  stars: number;
  syncStatus?: RepoSyncStatus | null;
};

/**
 * Whether the user has installed the Github app and on which account.
 * `accountLogin` is the Github username or org name the app was installed for.
 */
export type GithubInstallationStatus = {
  connected: boolean;
  accountLogin: string | null;
  installedAt: string | null;
};

/** The two billing tiers available in the app. */
export type SubscriptionPlan = 'free' | 'pro';

/** The user's current subscription state, used on the Settings page and in the sidebar user menu badge. */
export type UserSubscriptionState = {
  plan: SubscriptionPlan;
  status: 'active' | 'canceled' | 'trialing';
  renewsAt: string | null;
};
