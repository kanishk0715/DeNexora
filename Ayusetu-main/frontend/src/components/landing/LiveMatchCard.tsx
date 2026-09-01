import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DEMO_OPPORTUNITIES } from '../../data/demo';

export default function LiveMatchCard() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const opp = DEMO_OPPORTUNITIES[active];
  const slice = DEMO_OPPORTUNITIES.slice(0, 3);

  useEffect(() => {
    if (paused) return;
    const id = window.setInterval(() => setActive(i => (i + 1) % slice.length), 4200);
    return () => window.clearInterval(id);
  }, [paused, slice.length]);

  return (
    <div
      className="card overflow-hidden shadow-lg ring-1 ring-forest-900/5"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="flex items-center justify-between border-b border-slate-100 bg-gradient-to-r from-forest-50/80 to-white px-5 py-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-forest-600">Live match preview</p>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-600" />
          </span>
          {paused ? 'Paused' : 'Live'}
        </span>
      </div>
      <div className="p-5">
        <AnimatePresence mode="wait">
          <motion.div key={opp._id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}>
            <p className="text-lg font-bold tracking-tight text-ink-900">{opp.title}</p>
            <p className="mt-1 text-sm text-ink-500">
              {opp.organization} · {opp.location}
            </p>
            <div className="mt-5">
              <div className="mb-1 flex justify-between text-sm font-medium">
                <span className="text-ink-500">Fit with sample BAMS profile</span>
                <span className="tabular-nums text-forest-700">{opp.matchScore}%</span>
              </div>
              <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-forest-700 to-forest-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${opp.matchScore}%` }}
                  transition={{ duration: 0.55, ease: 'easeOut' }}
                />
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {opp.requiredSkills.map(s => (
                <span key={s.name} className="rounded-full border border-forest-100 bg-cream-50 px-2.5 py-1 text-xs font-medium text-forest-800">
                  {s.name}
                </span>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="grid grid-cols-3 border-t border-slate-100 bg-cream-100/80">
        {slice.map((o, i) => (
          <button
            key={o._id}
            type="button"
            onClick={() => setActive(i)}
            className={`relative px-3 py-3 text-left text-xs transition ${
              active === i ? 'bg-white font-semibold text-forest-800' : 'text-ink-500 hover:bg-white/80'
            }`}
          >
            {active === i && <span className="absolute inset-x-3 top-0 h-0.5 rounded-full bg-forest-600" />}
            {o.title.split(' ').slice(0, 2).join(' ')}
          </button>
        ))}
      </div>
    </div>
  );
}
