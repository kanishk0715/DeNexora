import { motion } from 'framer-motion';
import { PageHeader } from '../../components/ui/Primitives';

export default function IndustryProgramsPage() {
  return (
    <div className="mx-auto max-w-5xl">
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
        ].map((p, i) => (
          <motion.article
            key={p.t}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="card-hover p-5"
          >
            <h2 className="font-semibold text-ink-900">{p.t}</h2>
            <p className="mt-1 text-sm text-ink-500">
              {p.loc} · {p.seats} seats
            </p>
            <button type="button" className="btn-secondary mt-4">
              Nominate students
            </button>
          </motion.article>
        ))}
      </div>
    </div>
  );
}
