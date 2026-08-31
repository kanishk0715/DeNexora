import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Sparkles } from 'lucide-react';
import { PageHeader, MatchBar } from '../../components/ui/Primitives';
import { DEMO_OPPORTUNITIES } from '../../data/demo';
import { api } from '../../lib/api';
import { useAuth } from '../../contexts/AuthContext';

export default function OpportunitiesPage() {
  const { isDemo } = useAuth();
  const [query, setQuery] = useState('');
  const [type, setType] = useState('all');
  const [applied, setApplied] = useState<string[]>([]);
  const [consent, setConsent] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const [msg, setMsg] = useState('');

  const list = useMemo(() => {
    return DEMO_OPPORTUNITIES.filter(o => {
      const q = query.toLowerCase();
      const hit = !q || o.title.toLowerCase().includes(q) || o.organization.toLowerCase().includes(q) || o.location.toLowerCase().includes(q);
      const t = type === 'all' || o.type === type;
      return hit && t;
    });
  }, [query, type]);

  const apply = async (id: string) => {
    if (!consent) {
      setMsg('Please consent to share your profile with this organisation.');
      return;
    }
    if (!isDemo) {
      try {
        await api.post('/applications', { opportunityId: id });
      } catch {
        /* prototype still records locally */
      }
    }
    setApplied(a => [...a, id]);
    setSelected(null);
    setMsg('Application submitted. Track it under Internship & placement tracker.');
  };

  return (
    <div>
      <PageHeader
        kicker="Industry requirement portal"
        title="Internships & placements"
        subtitle="Hover a card, filter by type, then apply with consent. Ranked by AI match against verified AYUSH skills."
      />
      {msg && (
        <p className="mb-4 rounded-xl border border-forest-200 bg-forest-50 px-4 py-3 text-sm text-forest-800">{msg}</p>
      )}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <input className="input" placeholder="Search hospital, skill, city…" value={query} onChange={e => setQuery(e.target.value)} />
        <div className="flex gap-2">
          {['all', 'internship', 'job'].map(t => (
            <button
              key={t}
              type="button"
              onClick={() => setType(t)}
              className={`rounded-full px-4 py-2 text-xs font-semibold capitalize transition ${
                type === t ? 'bg-forest-700 text-white shadow' : 'bg-white text-ink-600 hover:bg-cream-200'
              }`}
            >
              {t === 'all' ? 'All' : t}
            </button>
          ))}
        </div>
      </div>
      <div className="grid gap-4">
        {list.map(o => (
          <motion.article
            key={o._id}
            layout
            whileHover={{ y: -4 }}
            className="card overflow-hidden p-0"
          >
            <div className="flex flex-col gap-4 p-5 lg:flex-row lg:items-start lg:justify-between">
              <div className="max-w-2xl">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-saffron-50 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide text-saffron-700">
                    {o.type}
                  </span>
                  {o.matchScore >= 85 && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-forest-50 px-2 py-0.5 text-[11px] font-semibold text-forest-800">
                      <Sparkles size={12} /> Strong fit
                    </span>
                  )}
                </div>
                <h2 className="mt-2 font-serif text-xl font-semibold text-forest-900">{o.title}</h2>
                <p className="mt-1 flex items-center gap-1 text-sm text-ink-500">
                  <MapPin size={14} /> {o.organization} · {o.location} · {o.workMode} · {o.duration}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-ink-700">{o.description}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {o.requiredSkills.map(s => (
                    <span key={s.name} className="rounded-full bg-cream-200 px-2.5 py-1 text-xs font-medium text-forest-800">
                      {s.name}
                    </span>
                  ))}
                </div>
              </div>
              <div className="w-full shrink-0 rounded-2xl bg-cream-100 p-4 lg:w-60">
                <MatchBar score={o.matchScore} />
                <p className="mt-3 text-xs text-ink-500">
                  {o.numberOfPositions} seats · {o.applicantCount} applied
                </p>
                <p className="text-xs font-medium text-forest-800">{o.stipend}</p>
                {applied.includes(o._id) ? (
                  <p className="mt-3 text-sm font-semibold text-forest-700">Applied ✓</p>
                ) : (
                  <button type="button" className="btn-primary mt-3 w-full" onClick={() => setSelected(o._id)}>
                    Apply
                  </button>
                )}
              </div>
            </div>
            <AnimatePresence>
              {selected === o._id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden border-t border-forest-100 bg-cream-50 px-5 py-4"
                >
                  <label className="flex items-start gap-2 text-sm text-ink-700">
                    <input type="checkbox" checked={consent} onChange={e => setConsent(e.target.checked)} className="mt-1" />
                    I consent to share my verified skill profile with {o.organization} (DPDP).
                  </label>
                  <div className="mt-3 flex gap-2">
                    <button type="button" className="btn-primary" onClick={() => apply(o._id)}>
                      Confirm application
                    </button>
                    <button type="button" className="btn-secondary" onClick={() => setSelected(null)}>
                      Cancel
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.article>
        ))}
      </div>
    </div>
  );
}
