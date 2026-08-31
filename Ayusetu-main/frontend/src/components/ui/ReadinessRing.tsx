export function ReadinessRing({ value, label = 'Readiness' }: { value: number; label?: string }) {
  const r = 54;
  const c = 2 * Math.PI * r;
  const offset = c - (Math.min(100, value) / 100) * c;
  return (
    <div className="relative mx-auto h-40 w-40">
      <div className="absolute inset-3 rounded-full bg-saffron-300/20" style={{ animation: 'pulse-ring 3s ease-in-out infinite' }} />
      <svg viewBox="0 0 128 128" className="relative h-full w-full -rotate-90">
        <circle cx="64" cy="64" r={r} fill="none" stroke="#efe4d2" strokeWidth="10" />
        <circle
          cx="64"
          cy="64"
          r={r}
          fill="none"
          stroke="url(#ring)"
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 1s ease' }}
        />
        <defs>
          <linearGradient id="ring" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#16553d" />
            <stop offset="100%" stopColor="#e8b86d" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-serif text-3xl font-semibold text-forest-800">{value}</span>
        <span className="text-[10px] font-semibold uppercase tracking-wider text-ink-500">{label}</span>
      </div>
    </div>
  );
}
