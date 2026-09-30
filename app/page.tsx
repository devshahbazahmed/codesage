import { Button } from "@/components/ui/button";
import { UserMenuWithSession } from "@/features/auth/components/UserMenu";

export default function Home() {
  return (
    <main className="flex min-h-svh items-center justify-between bg-[#1b171a] px-6 py-8 text-[#f5edf0]">
      <UserMenuWithSession variant="compact" />
      <Button className="bg-[#ff5a00] text-white hover:bg-[#ff7133]">Click me</Button>
    </main>
  );
}
