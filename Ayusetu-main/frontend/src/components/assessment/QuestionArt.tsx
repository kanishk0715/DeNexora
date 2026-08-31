export function QuestionArt({ id }: { id: string }) {
  const common = { viewBox: '0 0 160 100', className: 'h-auto w-full' as const };
  if (id === 'q1') {
    return (
      <svg {...common} aria-hidden>
        <rect width="160" height="100" rx="16" fill="#eef4fb" />
        <ellipse cx="80" cy="72" rx="36" ry="10" fill="#d9e8f6" />
        <path d="M58 70c0-22 10-42 22-42s22 20 22 42" fill="#1d4e89" />
        <path d="M70 38c8-10 20-8 24 2" fill="none" stroke="#c49a7a" strokeWidth="4" strokeLinecap="round" />
        <circle cx="92" cy="28" r="6" fill="#8f6246" />
      </svg>
    );
  }
  if (id === 'q2') {
    return (
      <svg {...common} aria-hidden>
        <rect width="160" height="100" rx="16" fill="#f7f1ec" />
        <path d="M28 58c18-22 38-22 52 0 14-22 36-22 52 0" fill="none" stroke="#1d4e89" strokeWidth="5" strokeLinecap="round" />
        <circle cx="80" cy="58" r="8" fill="#8f6246" />
        <path d="M80 58v-22" stroke="#173e6c" strokeWidth="3" strokeLinecap="round" />
      </svg>
    );
  }
  if (id === 'q3') {
    return (
      <svg {...common} aria-hidden>
        <rect width="160" height="100" rx="16" fill="#eef4fb" />
        <circle cx="80" cy="28" r="10" fill="#1d4e89" />
        <path d="M80 40v28M80 52l-22 8M80 52l22 8M80 68l-14 18M80 68l14 18" fill="none" stroke="#173e6c" strokeWidth="5" strokeLinecap="round" />
      </svg>
    );
  }
  if (id === 'q4') {
    return (
      <svg {...common} aria-hidden>
        <rect width="160" height="100" rx="16" fill="#f7f1ec" />
        <rect x="44" y="18" width="72" height="64" rx="8" fill="#fff" stroke="#1d4e89" strokeWidth="3" />
        <path d="M56 36h48M56 48h36M56 60h40" stroke="#8f6246" strokeWidth="3" strokeLinecap="round" />
      </svg>
    );
  }
  return (
    <svg {...common} aria-hidden>
      <rect width="160" height="100" rx="16" fill="#eef4fb" />
      <rect x="38" y="20" width="84" height="60" rx="8" fill="#fff" stroke="#1d4e89" strokeWidth="3" />
      <path d="M50 36h60M50 48h48M50 60h40" stroke="#1d4e89" strokeWidth="3" strokeLinecap="round" />
      <circle cx="118" cy="70" r="10" fill="#8f6246" />
    </svg>
  );
}
