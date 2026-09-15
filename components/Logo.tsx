import Image from 'next/image';
import { cn } from '@/lib/utils';

type LogoProps = {
  className?: string;
  wordmarkClassName?: string;
};

const Logo = ({ className, wordmarkClassName }: LogoProps) => {
  return (
    <div className={cn('flex min-w-0 items-center gap-3', className)}>
      <Image
        src="/logo.svg"
        alt="logo"
        width={30}
        height={30}
        className="shrink-0"
      />
      <h3
        className={cn(
          'text-3xl font-bold tracking-tight text-white',
          wordmarkClassName
        )}
      >
        Code<span className="text-primary">Sage</span>
      </h3>
    </div>
  );
};

export default Logo;
