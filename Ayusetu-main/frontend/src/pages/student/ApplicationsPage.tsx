import { PageHeader, MatchBar } from '../../components/ui/Primitives';
import { DEMO_APPLICATIONS } from '../../data/demo';

const COLUMNS: { id: string; label: string; match: string[] }[] = [
  { id: 'applied', label: 'Applied', match: ['applied'] },
  { id: 'review', label: 'Review', match: ['under_review', 'shortlisted'] },
  { id: 'interview', label: 'Interview', match: ['interview'] },
  { id: 'offer', label: 'Offer', match: ['selected', 'offered', 'joined'] },
];

export default function ApplicationsPage() {
  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        kicker="Internship & placement tracker"
        title="Your pipeline"
        subtitle="Cards sit in Applied → Review → Interview → Offer as the hospital moves you forward."
      />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {COLUMNS.map(col => {
          const cards = DEMO_APPLICATIONS.filter(a => col.match.includes(a.status));
          return (
            <section key={col.id} className="rounded-2xl bg-cream-200/60 p-3">
              <div className="mb-3 flex items-center justify-between px-1">
                <h2 className="text-sm font-bold text-ink-900">{col.label}</h2>
                <span className="rounded-full bg-white px-2 py-0.5 text-xs font-semibold text-forest-800">{cards.length}</span>
              </div>
              <div className="min-h-[140px] space-y-3">
                {cards.length === 0 && (
                  <p className="px-2 py-8 text-center text-xs text-ink-500">None yet</p>
                )}
                {cards.map(a => (
                  <article key={a._id} className="card p-4">
                    <h3 className="font-semibold text-ink-900">{a.title}</h3>
                    <p className="mt-1 text-xs text-ink-500">
                      {a.organization} · {a.appliedAt}
                    </p>
                    <div className="mt-3">
                      <MatchBar score={a.matchScore} />
                    </div>
                  </article>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
