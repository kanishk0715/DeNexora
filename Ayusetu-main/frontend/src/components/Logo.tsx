import type { User } from '../types/api';

export function Logo({ compact = false, light = false }: { compact?: boolean; light?: boolean }) {
  return (
    <div className="flex items-center gap-2.5">
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none" aria-hidden>
        <rect width="36" height="36" rx="10" fill={light ? '#0F2F27' : '#143D32'} />
        <path
          d="M18 7c.45 3.6 2.9 6.7 7 8.3-4.1 1.6-6.55 4.7-7 8.3-.45-3.6-2.9-6.7-7-8.3C15.1 13.7 17.55 10.6 18 7Z"
          fill="#E8B86D"
        />
        <circle cx="18" cy="15.4" r="2.4" fill="#F7F1E8" />
      </svg>
      <div className={compact ? 'hidden sm:block' : ''}>
        <p className={`font-serif text-lg font-semibold leading-none ${light ? 'text-cream-50' : 'text-forest-800'}`}>
          AyuSetu
        </p>
        {!compact && (
          <p className={`mt-0.5 text-[10px] font-medium uppercase tracking-[0.14em] ${light ? 'text-saffron-300' : 'text-saffron-600'}`}>
            AYUSH skill bridge
          </p>
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
