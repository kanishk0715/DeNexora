export function PageHeader({
  kicker,
  title,
  subtitle,
  actions,
}: {
  kicker?: string;
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        {kicker && (
          <p className="mb-1 text-xs font-semibold uppercase tracking-[0.16em] text-saffron-600">{kicker}</p>
        )}
        <h1 className="font-serif text-3xl font-semibold text-forest-900 sm:text-4xl">{title}</h1>
        {subtitle && <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-500">{subtitle}</p>}
      </div>
      {actions}
    </div>
  );
}

export function MatchBar({ score }: { score: number }) {
  const tone =
    score >= 80
      ? 'from-forest-600 to-emerald-400'
      : score >= 65
        ? 'from-saffron-500 to-saffron-300'
        : 'from-stone-400 to-stone-300';
  return (
    <div>
      <div className="mb-1 flex justify-between text-xs font-medium text-ink-700">
        <span>AI match</span>
        <span>{score}%</span>
      </div>
      <div className="h-2.5 overflow-hidden rounded-full bg-stone-100">
        <div
          className={`h-full rounded-full bg-gradient-to-r ${tone} transition-all duration-700`}
          style={{ width: `${Math.min(100, score)}%` }}
        />
      </div>
    </div>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    applied: 'bg-stone-100 text-ink-700',
    under_review: 'bg-amber-50 text-amber-800 ring-1 ring-amber-200',
    shortlisted: 'bg-forest-50 text-forest-800 ring-1 ring-forest-200',
    interview: 'bg-saffron-50 text-saffron-700 ring-1 ring-saffron-200',
    selected: 'bg-emerald-50 text-emerald-800 ring-1 ring-emerald-200',
    placed: 'bg-emerald-50 text-emerald-800 ring-1 ring-emerald-200',
    rejected: 'bg-red-50 text-red-700',
    withdrawn: 'bg-stone-100 text-stone-500',
  };
  const cls = map[status] || 'bg-stone-100 text-ink-700';
  return (
    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${cls}`}>
      {status.replace(/_/g, ' ')}
    </span>
  );
}

export function StatCard({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="card-hover p-5">
      <p className="text-xs font-semibold uppercase tracking-wide text-ink-500">{label}</p>
      <p className="mt-2 font-serif text-3xl font-semibold text-forest-800">{value}</p>
      {hint && <p className="mt-1 text-xs text-ink-500">{hint}</p>}
    </div>
  );
}
