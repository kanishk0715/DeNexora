import { useMemo, useState } from 'react';
import { STATE_PLACEMENTS } from '../../data/demo';

const REGIONS = ['All', 'North', 'South', 'East', 'West', 'Central'] as const;
const MAX = Math.max(...STATE_PLACEMENTS.map(s => s.internships + s.jobs));

export function StatePulseGrid() {
  const [region, setRegion] = useState<(typeof REGIONS)[number]>('All');
  const list = useMemo(
    () => STATE_PLACEMENTS.filter(s => region === 'All' || s.region === region),
    [region],
  );

  return (
    <div>
      <div className="mb-4 flex flex-wrap gap-2">
        {REGIONS.map(r => (
          <button
            key={r}
            type="button"
            onClick={() => setRegion(r)}
            className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
              region === r ? 'bg-forest-700 text-white' : 'bg-cream-100 text-ink-700 hover:bg-cream-200'
            }`}
          >
            {r}
          </button>
        ))}
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {list.map(s => {
          const total = s.internships + s.jobs;
          const pct = Math.round((total / MAX) * 100);
          return (
            <article key={s.code} className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-card">
              <div className="flex h-1.5">
                <span className="flex-[2] bg-saffron-500" />
                <span className="flex-1 bg-cream-50" />
                <span className="flex-[2] bg-forest-600" />
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-semibold text-ink-900">{s.state}</h3>
                  <span className="rounded-md bg-cream-100 px-1.5 py-0.5 text-[10px] font-bold tracking-wide text-forest-800">
                    {s.code}
                  </span>
                </div>
                <p className="mt-3 text-2xl font-bold tabular-nums text-forest-800">{s.internships}</p>
                <p className="text-xs text-ink-500">internships</p>
                <p className="mt-2 text-sm font-semibold tabular-nums text-saffron-700">{s.jobs} jobs</p>
                <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-cream-200">
                  <div className="h-full rounded-full bg-forest-600" style={{ width: `${pct}%` }} />
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
