import { PageHeader, StatusBadge, MatchBar } from '../../components/ui/Primitives';
import { DEMO_APPLICATIONS } from '../../data/demo';

const PIPELINE = ['applied', 'under_review', 'shortlisted', 'interview', 'selected'];

export default function ApplicationsPage() {
  return (
    <div>
      <PageHeader
        kicker="Internship & placement tracker"
        title="Your pipeline"
        subtitle="One dashboard from apply to offer. Status changes notify you in-app."
      />
      <div className="space-y-4">
        {DEMO_APPLICATIONS.map(a => (
          <article key={a._id} className="card p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="font-semibold text-forest-900">{a.title}</h2>
                <p className="text-sm text-ink-500">
                  {a.organization} · applied {a.appliedAt}
                </p>
              </div>
              <StatusBadge status={a.status} />
            </div>
            <div className="mt-4 max-w-xs">
              <MatchBar score={a.matchScore} />
            </div>
            <ol className="mt-5 flex flex-wrap gap-2">
              {PIPELINE.map(s => {
                const done = a.history.includes(s) || a.status === s;
                const current = a.status === s;
                return (
                  <li
                    key={s}
                    className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${
                      current ? 'bg-forest-700 text-white' : done ? 'bg-forest-100 text-forest-800' : 'bg-stone-100 text-stone-400'
                    }`}
                  >
                    {s.replace('_', ' ')}
                  </li>
                );
              })}
            </ol>
          </article>
        ))}
      </div>
    </div>
  );
}
