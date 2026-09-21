'use client';

import { Button } from '@/components/ui/button';
import { useFormStatus } from 'react-dom';
import { Spinner } from '@/components/ui/spinner';
import { cn } from '@/lib/utils';

export function GithubIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 640 640"
      className={cn('size-7 shrink-0', className)}
      fill="currentColor"
    >
      <path d="M280.5 426.5C214.5 418.5 168 371 168 309.5C168 284.5 177 257.5 192 239.5C185.5 223 186.5 188 194 173.5C214 171 241 181.5 257 196C276 190 296 187 320.5 187C345 187 365 190 383 195.5C398.5 181.5 426 171 446 173.5C453 187 454 222 447.5 239C463.5 258 472 283.5 472 309.5C472 371 425.5 417.5 358.5 426C375.5 437 387 461 387 488.5L387 540.5C387 555.5 399.5 564 414.5 558C505 523.5 576 433 576 321C576 179.5 461 64 319.5 64C178 64 64 179.5 64 321C64 432 134.5 524 229.5 558.5C243 563.5 256 554.5 256 541L256 501C249 504 240 506 232 506C199 506 179.5 488 165.5 454.5C160 441 154 433 142.5 431.5C136.5 431 134.5 428.5 134.5 425.5C134.5 419.5 144.5 415 154.5 415C169 415 181.5 424 194.5 442.5C204.5 457 215 463.5 227.5 463.5C240 463.5 248 459 259.5 447.5C268 439 274.5 431.5 280.5 426.5z" />
    </svg>
  );
}

const SocialLoginButton = ({ className }: { className?: string }) => {
  const { pending } = useFormStatus();

  let buttonLabel = 'Continue with Github';
  let buttonIcon = <GithubIcon />;

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
