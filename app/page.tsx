import { Button } from '@/components/ui/button';
import { UserMenuWithSession } from '@/features/auth/components/UserMenu';

export default function Home() {
  return (
    <main className="flex justify-between items-center">
      <UserMenuWithSession variant="compact" />
      <Button>Click me</Button>
    </main>
  );
}
