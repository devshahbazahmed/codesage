import React from 'react';
import { GithubInstallationStatus } from '@/features/dashboard/lib/types';
import {
  statusBadge,
  statusButtonClass,
} from '@/features/dashboard/lib/status-styles';
import { getGithubInstallUrl } from '../utils/github-app';
import { disconnectGithubApp } from '../actions';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ExternalLinkIcon, UnplugIcon } from 'lucide-react';
import { GithubIcon } from '@/features/auth/components/SocialLoginButton';

type GithubConnectCardProps = {
  userId: string;
  installation: GithubInstallationStatus;
};

function ConnectedDetails({ accountLogin }: { accountLogin: string | null }) {
  return (
    <p className="text-xs text-[#d7c6ba]">
      Installed for{' '}
      <span className="font-medium text-[#ffb278]">@{accountLogin}</span>. The
      app can read repository metadata and post review comments on pull
      requests.
    </p>
  );
}

function DisconnectedDetails() {
  return (
    <ul className="list-inside list-disc space-y-1 text-xs text-[#d7c6ba]/80">
      <li>Access public and private repositories you select</li>
      <li>Receive webhooks for pull request events</li>
      <li>Post AI-generated review comments on PRs</li>
    </ul>
  );
}

function ConnectedActions() {
  return (
    <form action={disconnectGithubApp}>
      <Button
        type="submit"
        variant="outline"
        className={statusButtonClass.danger}
      >
        <UnplugIcon />
        Disconnect GitHub App
      </Button>
    </form>
  );
}

function DisconnectedActions({ installUrl }: { installUrl: string }) {
  return (
    <a
      href={installUrl}
      className={cn('rounded-md', statusButtonClass.success)}
      target="_blank"
      rel="noreferrer"
    >
      <Button
        type="button"
        variant="default"
        className={statusButtonClass.success}
      >
        <GithubIcon />
        Install GitHub App
        <ExternalLinkIcon className="size-3 opacity-80" />
      </Button>
    </a>
  );
}

function ConnectionDetails({
  connected,
  accountLogin,
}: {
  connected: boolean;
  accountLogin: string | null;
}) {
  if (connected) {
    return <ConnectedDetails accountLogin={accountLogin} />;
  }

  return <DisconnectedDetails />;
}

function ConnectionActions({
  connected,
  installUrl,
}: {
  connected: boolean;
  installUrl: string;
}) {
  if (connected) {
    return <ConnectedActions />;
  }

  return <DisconnectedActions installUrl={installUrl} />;
}

export default function GithubConnectCard({
  userId,
  installation,
}: GithubConnectCardProps) {
  const { accountLogin, connected } = installation;
  // installUrl encodes userId so that the callback can associate the installation
  const installUrl = getGithubInstallUrl(userId);

  // Default to neutral styling; switch to warm orange when connected.
  let cardBorderClass = 'border-[#30211d] bg-[#171214]';
  let iconWrapperClass = 'border-[#352925] bg-[#1e1717] text-[#f5efe8]';
  let statusTone: 'success' | 'neutral' = 'neutral';
  let statusLabel = 'Not Connected';

  if (connected) {
    cardBorderClass = 'border-[#ff7a1a]/35 bg-[#1b1516]';
    iconWrapperClass = 'border-[#ff7a1a]/40 bg-[#ff7a1a]/10 text-[#ffb278]';
    statusTone = 'success';
    statusLabel = 'Connected';
  }

  return (
    <div className="flex flex-1 flex-col gap-6 bg-[#120f13] p-6">
      <Card
        className={cn(
          'max-w-2xl shadow-[0_0_0_1px_rgba(255,122,26,0.04)] transition-colors',
          cardBorderClass
        )}
      >
        <CardHeader className="border-b border-[#2d201d] pb-5">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span
                className={cn(
                  'flex size-10 items-center justify-center rounded-none border',
                  iconWrapperClass
                )}
              >
                <GithubIcon className="size-5" />
              </span>
              <div>
                <CardTitle className="text-[#f5efe8]">Github App</CardTitle>
                <CardDescription className="text-[#cbb8ad]">
                  Install the CodeSage reviewer app on your GitHub account or
                  organization to access public and private repositories.
                </CardDescription>
              </div>
            </div>
            <span className={statusBadge(statusTone)}>{statusLabel}</span>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 bg-[#171214] text-[#f5efe8]">
          <ConnectionDetails
            connected={connected}
            accountLogin={accountLogin}
          />
        </CardContent>
        <CardFooter className="flex flex-wrap gap-2 border-t border-[#2d201d] bg-[#171214]">
          <ConnectionActions connected={connected} installUrl={installUrl} />
        </CardFooter>
      </Card>
    </div>
  );
}
