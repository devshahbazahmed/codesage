'use server';

import { redirect } from 'next/navigation';
import { getServerSession } from '../../auth/actions';
import { deleteInstallation } from '../server/installation';
import { DASHBOARD_ROUTES } from '../../dashboard/lib/routes';

export async function disconnectGithubApp() {
  const session = await getServerSession();

  if (!session) {
    redirect('/sign-in');
  }

  await deleteInstallation(session.user.id);
  redirect(DASHBOARD_ROUTES.github);
}
