import type { ReactNode } from 'react';
import { TirangaBar } from '../layout/TirangaBar';

export function MinistryLogo({
  className = 'h-12 w-auto sm:h-14',
  invert = false,
}: {
  className?: string;
  invert?: boolean;
}) {
  return (
    <img
      src="/ministry-ayush-logo.png"
      alt="Ministry of Ayush, Government of India"
      className={`shrink-0 object-contain ${invert ? 'invert' : ''} ${className}`}
      width={200}
      height={200}
    />
  );
}

export function BrandLockup() {
  return (
    <span className="nav-lockup">
      <MinistryLogo className="h-10 w-auto bg-white sm:h-11" />
      <span className="hidden min-w-0 flex-col justify-center border-l border-neutral-200 pl-2.5 sm:flex">
        <span className="text-[11px] font-semibold leading-tight tracking-wide">Ministry of Ayush</span>
        <span className="mt-0.5 text-[10px] font-medium leading-tight tracking-wider text-neutral-700">AyuSetu</span>
      </span>
    </span>
  );
}

export function IndiaAppBar({
  children,
  after,
  innerClassName = 'mx-auto max-w-6xl px-4',
  variant = 'dark',
  showTiranga = true,
}: {
  children: ReactNode;
  after?: ReactNode;
  innerClassName?: string;
  variant?: 'dark' | 'light' | 'wallpaper';
  showTiranga?: boolean;
}) {
  const headerClass =
    variant === 'light'
      ? 'sticky top-0 z-40 shrink-0 border-b border-forest-100 bg-cream-50/90 shadow-sm backdrop-blur-md'
      : variant === 'wallpaper'
        ? 'nav-wallpaper sticky top-0 z-40 shrink-0 border-b border-white/20 bg-[#111] text-white'
        : 'sticky top-0 z-40 shrink-0 border-b border-forest-950 bg-forest-900 shadow-[0_2px_10px_rgba(12,22,17,0.35)]';
    
  const padClass = variant === 'wallpaper' ? 'py-3.5 sm:py-4' : 'py-2.5 sm:py-3';

  return (
    <header className={headerClass}>
      {showTiranga && <TirangaBar size="md" />}
      <div className={`flex items-center justify-between gap-3 ${padClass} ${innerClassName}`}>{children}</div>
      {after}
      {showTiranga && <TirangaBar size="sm" />}
    </header>
  );
}
