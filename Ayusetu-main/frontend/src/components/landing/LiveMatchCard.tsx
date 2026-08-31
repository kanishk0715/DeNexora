import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DEMO_OPPORTUNITIES } from '../../data/demo';

export default function LiveMatchCard() {
  const [active, setActive] = useState(0);
  const opp = DEMO_OPPORTUNITIES[active];

  return (
    <div className="relative">
      <div className="animate-float absolute -right-4 -top-6 hidden h-24 w-24 rounded-full bg-saffron-300/40 blur-2xl lg:block" />
      <div className="card overflow-hidden p-1 shadow-lift">
        <div className="rounded-[14px] bg-gradient-to-br from-forest-800 via-forest-700 to-forest-900 p-5 text-cream-50">
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-saffron-300">Live AI matching</p>
            <span className="flex items-center gap-1.5 text-xs text-cream-200">
              <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
              Scoring
            </span>
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={opp._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className="mt-4"
            >
              <p className="font-serif text-2xl leading-snug">{opp.title}</p>
              <p className="mt-1 text-sm text-cream-200/80">
                {opp.organization} · {opp.location}
              </p>
              <div className="mt-5 rounded-xl bg-white/10 p-4 backdrop-blur">
                <div className="mb-2 flex justify-between text-xs">
                  <span>Match with Ananya’s profile</span>
                  <span className="font-bold text-saffron-300">{opp.matchScore}%</span>
                </div>
                <div className="h-2.5 overflow-hidden rounded-full bg-white/15">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-saffron-300 to-emerald-300"
                    initial={{ width: 0 }}
                    animate={{ width: `${opp.matchScore}%` }}
                    transition={{ type: 'spring', stiffness: 80, damping: 18 }}
                  />
                </div>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {opp.requiredSkills.map(s => (
                    <span key={s.name} className="rounded-full bg-white/10 px-2 py-0.5 text-[11px]">
                      {s.name}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
        <div className="grid grid-cols-3 gap-1 p-2">
          {DEMO_OPPORTUNITIES.slice(0, 3).map((o, i) => (
            <button
              key={o._id}
              type="button"
              onClick={() => setActive(i)}
              className={`rounded-xl px-2 py-3 text-left text-[11px] leading-snug transition ${
                active === i ? 'bg-forest-50 font-semibold text-forest-900 ring-1 ring-forest-200' : 'text-ink-500 hover:bg-cream-100'
              }`}
            >
              {o.title.split(' ').slice(0, 2).join(' ')}
            </button>
          ))}
        </div>
      </div>
      <p className="mt-3 text-center text-xs text-ink-500">Click a posting to rescore the match</p>
    </div>
  );
}
