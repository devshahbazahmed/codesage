'use client';

import { Button } from '@/components/ui/button';
import { useFormStatus } from 'react-dom';
import { Spinner } from '@/components/ui/spinner';
import Image from 'next/image';

const SocialLoginButton = ({ className }: { className?: string }) => {
  const { pending } = useFormStatus();

  let buttonLabel = 'Continue with Github';
  let buttonIcon = (
    <Image src="/icons/github.svg" alt="github" width={25} height={25} />
  );

  if (pending) {
    buttonLabel = 'Redirecting to Github...';
    buttonIcon = <Spinner className="size-4" />;
  }

  return (
    <Button
      type="submit"
      size={'lg'}
      disabled={pending}
      className={`h-12.75 w-full border-white/9 bg-white text-[14px] font-medium text-zinc-900 shadow-none transition-all hover:border-white/90 hover:bg-white/98 hover:text-zinc-950 ${className}`}
    >
      {buttonIcon}
      <span className="ml-2">{buttonLabel}</span>
    </Button>
  );
};

export default SocialLoginButton;
