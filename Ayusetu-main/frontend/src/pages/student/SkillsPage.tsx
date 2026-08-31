import { PageHeader, MatchBar } from '../../components/ui/Primitives';
import { DEMO_SKILLS } from '../../data/demo';

export default function SkillsPage() {
  return (
    <div>
      <PageHeader
        kicker="AI skill mapping"
        title="Your AYUSH skill map"
        subtitle="Self-declared skills stay private until an institution verifies them. Verified skills weigh more in match scoring."
      />
      <div className="grid gap-4 md:grid-cols-2">
        {DEMO_SKILLS.map(s => (
          <article key={s.name} className="card-hover p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="font-semibold text-forest-900">{s.name}</h2>
                <p className="text-xs text-ink-500">Industry benchmark {s.benchmark}</p>
              </div>
              <span
                className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                  s.verified ? 'bg-forest-50 text-forest-800' : 'bg-stone-100 text-ink-500'
                }`}
              >
                {s.verified ? 'Verified' : 'Self-declared'}
              </span>
            </div>
            <div className="mt-4">
              <MatchBar score={s.score} />
            </div>
            {s.score < s.benchmark && (
              <p className="mt-3 text-xs text-saffron-700">
                Gap of {s.benchmark - s.score} points — recommended: supervised clinical hours + documentation module.
              </p>
            )}
          </article>
        ))}
      </div>
    </div>
  );
}
