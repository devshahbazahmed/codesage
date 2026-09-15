import Image from 'next/image';

const Logo = () => {
  return (
    <div className="flex gap-3">
      <Image src="/logo.svg" alt="logo" width={30} height={30} />
      <h3 className="text-3xl font-bold tracking-tight text-white">
        Code<span className="text-primary">Sage</span>
      </h3>
    </div>
  );
};

export default Logo;
