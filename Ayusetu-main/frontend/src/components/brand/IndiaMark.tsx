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
    <header className="sticky top-0 z-40 bg-white shadow-sm">
      <TirangaBar />
      <div className={`flex w-full items-center justify-between gap-3 py-2 ${innerClassName}`}>{children}</div>
      {after}
    </header>
  );
}
