import type { User } from '../types/api';

export function Logo({ compact = false, light = false }: { compact?: boolean; light?: boolean }) {
  return (
    <div className="flex items-center gap-2.5">
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none" aria-hidden>
        <rect width="36" height="36" rx="10" fill={light ? '#ffffff' : '#16553d'} />
        <path d="M9 25V13h2.8v12H9Zm15.2 0V13H27v12h-2.8Z" fill={light ? '#16553d' : '#fff'} />
        <path d="M9 15.2h18" stroke={light ? '#16553d' : '#f4a85c'} strokeWidth="1.8" strokeLinecap="round" />
        <circle cx="18" cy="15.2" r="2.1" fill={light ? '#c45c26' : '#f4a85c'} />
      </svg>
      <div className={compact ? 'hidden sm:block' : ''}>
        <p className={`text-[1.15rem] font-bold leading-none tracking-tight ${light ? 'text-white' : 'text-forest-800'}`}>
          AyuSetu
        </p>
        {!compact && (
          <p className={`mt-0.5 text-[10px] font-medium ${light ? 'text-white/70' : 'text-ink-500'}`}>AYUSH skill bridge</p>
        )}
      </div>
    </div>
  );
}

export const ROLE_LABEL: Record<User['role'], string> = {
  student: 'Student',
  academician: 'Faculty',
  industry: 'Industry',
  institution: 'Institution',
  admin: 'Ministry / Admin',
};
