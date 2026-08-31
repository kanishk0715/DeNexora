import { PageHeader } from '../../components/ui/Primitives';

export default function IndustryProgramsPage() {
  return (
    <div>
      <PageHeader
        kicker="Skilling seats"
        title="Short-term training & guideship"
        subtitle="Aligned to CCRAS internship, guideship and exposure-visit guidelines."
      />
      <div className="grid gap-4 md:grid-cols-2">
        {[
          { t: 'Panchakarma theatre rotation', seats: 12, loc: 'AIIA New Delhi' },
          { t: 'Yoga therapy for NCD clinics', seats: 8, loc: 'MDNIY' },
          { t: 'Unani pharmacy GMP module', seats: 6, loc: 'CCRUM Hyderabad' },
          { t: 'Community AYUSH outreach', seats: 20, loc: 'Multi-state' },
        ].map(p => (
          <article key={p.t} className="card p-5">
            <h2 className="font-semibold text-forest-900">{p.t}</h2>
            <p className="mt-1 text-sm text-ink-500">
              {p.loc} · {p.seats} seats
            </p>
          </article>
        ))}
      </div>
    </div>
  );
}
