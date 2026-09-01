import type { ReactNode } from 'react';
import { TirangaBar } from '../layout/TirangaBar';

export function MinistryLogo({ className = 'h-12 w-auto sm:h-14' }: { className?: string }) {
  return (
    <img
      src="/ministry-ayush-logo.png"
      alt="Ministry of Ayush, Government of India"
      className={`shrink-0 bg-white object-contain ${className}`}
      width={200}
      height={200}
    />
  );
}

export function IndiaAppBar({
  children,
  after,
  innerClassName = 'mx-auto max-w-6xl px-4',
}: {
  children: ReactNode;
  after?: ReactNode;
  innerClassName?: string;
}) {
  return (
<<<<<<< HEAD
    <header className="sticky top-0 z-40 bg-white shadow-sm">
      <TirangaBar />
      <div className={`flex w-full items-center justify-between gap-3 py-2 ${innerClassName}`}>{children}</div>
=======
    <header className="sticky top-0 z-40 shrink-0 border-b border-[#e4f4ea] bg-white/90 shadow-[0_1px_0_rgba(22,85,61,0.04)] backdrop-blur-md">
      <div className={`flex items-center justify-between gap-3 py-3 sm:py-3.5 ${innerClassName}`}>{children}</div>
>>>>>>> 2652aa3ab5b0111cb25f4ab1df884001c4fe0b8c
      {after}
    </header>
  );
}
