import type { ReactNode } from 'react';

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
  variant = 'dark',
}: {
  children: ReactNode;
  after?: ReactNode;
  innerClassName?: string;
  variant?: 'dark' | 'light';
}) {
  const headerClass = variant === 'light' 
    ? "sticky top-0 z-40 shrink-0 border-b-2 border-forest-300 bg-gradient-to-r from-forest-100 to-forest-50 shadow-md backdrop-blur-sm"
    : "sticky top-0 z-40 shrink-0 border-b border-[#084830] bg-[#0b5c3a] shadow-[0_2px_8px_rgba(0,0,0,0.25)]";
    
  return (
    <header className={headerClass}>
      <div className={`flex items-center justify-between gap-3 py-3 sm:py-3.5 ${innerClassName}`}>{children}</div>
      {after}
    </header>
  );
}
