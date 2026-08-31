import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DEMO_OPPORTUNITIES } from '../../data/demo';

export default function LiveMatchCard() {
  const [active, setActive] = useState(0);
  const opp = DEMO_OPPORTUNITIES[active];

  return (
    <div className="card overflow-hidden">
      <div className="flex items-center justify-between border-b border-slate-100 px-5 py-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-forest-600">AI match</p>
        <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700">Live</span>
      </div>
      <div className="p-5">
        <AnimatePresence mode="wait">
          <motion.div key={opp._id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <p className="text-lg font-bold text-ink-900">{opp.title}</p>
            <p className="mt-1 text-sm text-ink-500">
              {opp.organization} · {opp.location}
            </p>
            <div className="mt-5">
              <div className="mb-1 flex justify-between text-sm font-medium">
                <span className="text-ink-500">Fit with sample profile</span>
                <span className="text-forest-700">{opp.matchScore}%</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                <motion.div
                  className="h-full rounded-full bg-forest-600"
                  initial={{ width: 0 }}
                  animate={{ width: `${opp.matchScore}%` }}
                  transition={{ duration: 0.4 }}
                />
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {opp.requiredSkills.map(s => (
                <span key={s.name} className="rounded-full bg-cream-100 px-2.5 py-1 text-xs text-forest-800">
                  {s.name}
                </span>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="grid grid-cols-3 border-t border-slate-100 bg-cream-100/80">
        {DEMO_OPPORTUNITIES.slice(0, 3).map((o, i) => (
          <button
            key={o._id}
            type="button"
            onClick={() => setActive(i)}
            className={`px-3 py-3 text-left text-xs ${
              active === i ? 'bg-white font-semibold text-forest-800' : 'text-ink-500 hover:bg-white/70'
            }`}
          >
            {o.title.split(' ').slice(0, 2).join(' ')}
          </button>
        ))}
      </div>
    </div>
  );
}
