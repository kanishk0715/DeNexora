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
        {kicker && <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-forest-600">{kicker}</p>}
        <h1 className="text-3xl font-bold tracking-tight text-ink-900">{title}</h1>
        {subtitle && <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-500">{subtitle}</p>}
      </div>
      {actions}
    </div>
  );
}

export function MatchBar({ score }: { score: number }) {
  return (
    <div>
      <div className="mb-1 flex justify-between text-xs font-medium text-ink-500">
        <span>Match</span>
        <span className="text-forest-700">{score}%</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-slate-100">
        <div className="h-full rounded-full bg-forest-600 transition-all duration-700" style={{ width: `${Math.min(100, score)}%` }} />
      </div>
    </div>
  );
}

export function StatusBadge({ status }: { status: string }) {
  return (
    <span className="inline-flex rounded-full bg-forest-50 px-2.5 py-0.5 text-xs font-semibold capitalize text-forest-800">
      {status.replace(/_/g, ' ')}
    </span>
  );
}

export function StatCard({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="card p-5">
      <p className="text-xs font-semibold uppercase tracking-wide text-ink-500">{label}</p>
      <p className="mt-2 text-3xl font-bold text-forest-800">{value}</p>
      {hint && <p className="mt-1 text-xs text-ink-500">{hint}</p>}
    </div>
  );
}
