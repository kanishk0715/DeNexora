import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Bookmark, BookmarkCheck, GitCompare, MapPin, Sparkles, Brain } from 'lucide-react';
import { PageHeader, MatchBar, EmptyState, Modal, SkillChipPicker } from '../../components/ui/Primitives';
import { DEMO_OPPORTUNITIES, DEMO_SKILLS } from '../../data/demo';
import { api, semanticProfileMatch, explainOpportunityMatch } from '../../lib/api';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';

const CITIES = ['All', ...Array.from(new Set(DEMO_OPPORTUNITIES.map(o => o.location)))];
const SKILL_FILTERS = Array.from(new Set(DEMO_OPPORTUNITIES.flatMap(o => o.requiredSkills.map(s => s.name))));
const SAVED_KEY = 'ayusetu-saved-opps';

function loadSaved(): string[] {
  try {
    return JSON.parse(localStorage.getItem(SAVED_KEY) || '[]');
  } catch {
    return [];
  }
}

export default function OpportunitiesPage() {
  const { isDemo } = useAuth();
  const { toast, dismiss } = useToast();
  const [query, setQuery] = useState('');
  const [type, setType] = useState('all');
  const [city, setCity] = useState('All');
  const [skills, setSkills] = useState<string[]>([]);
  const [savedOnly, setSavedOnly] = useState(false);
  const [saved, setSaved] = useState<string[]>(loadSaved);
  const [compare, setCompare] = useState<string[]>([]);
  const [showCompare, setShowCompare] = useState(false);
  const [applied, setApplied] = useState<string[]>([]);
  const [consent, setConsent] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const [semanticRanked, setSemanticRanked] = useState<string[] | null>(null);
  const [semanticBusy, setSemanticBusy] = useState(false);
  const [why, setWhy] = useState<Record<string, string>>({});

  const list = useMemo(() => {
    const filtered = DEMO_OPPORTUNITIES.filter(o => {
      const q = query.toLowerCase();
      const hit =
        !q ||
        o.title.toLowerCase().includes(q) ||
        o.organization.toLowerCase().includes(q) ||
        o.location.toLowerCase().includes(q);
      const t = type === 'all' || o.type === type;
      const c = city === 'All' || o.location === city;
      const sk =
        skills.length === 0 || skills.some(name => o.requiredSkills.some(s => s.name === name));
      const s = !savedOnly || saved.includes(o._id);
      return hit && t && c && sk && s;
    });

    // If semantic ranking is active, reorder by semantic similarity
    if (semanticRanked) {
      return [...filtered].sort(
        (a, b) => semanticRanked.indexOf(a._id) - semanticRanked.indexOf(b._id)
      );
    }
    return filtered;
  }, [query, type, city, skills, savedOnly, saved, semanticRanked]);

  const current = DEMO_OPPORTUNITIES.find(o => o._id === selected);
  const pair = DEMO_OPPORTUNITIES.filter(o => compare.includes(o._id));

  const toggleSave = (id: string) => {
    setSaved(prev => {
      const next = prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id];
      localStorage.setItem(SAVED_KEY, JSON.stringify(next));
      toast('success', prev.includes(id) ? 'Removed from saved' : 'Saved to bookmarks');
      return next;
    });
  };

  // Build a text profile from demo skills, then rank opportunities semantically
  const runSemanticRank = async () => {
    if (semanticRanked) {
      setSemanticRanked(null);
      return;
    }
    setSemanticBusy(true);
    const profileText = DEMO_SKILLS.map(s => `${s.name} (score ${s.score})`).join(', ');
    const oppDescriptions = DEMO_OPPORTUNITIES.map(o => ({
      id: o._id,
      description: `${o.title}. ${o.description} Required: ${o.requiredSkills.map(s => s.name).join(', ')}.`,
    }));
    const matches = await semanticProfileMatch(profileText, oppDescriptions, 10);
    if (matches.length > 0) {
      setSemanticRanked(matches.map(m => m.opportunity_id));
      const notes: Record<string, string> = {};
      await Promise.all(
        DEMO_OPPORTUNITIES.map(async o => {
          const exp = await explainOpportunityMatch(
            o.title,
            DEMO_SKILLS.map(s => ({ name: s.name, score: s.score })),
            o.requiredSkills.map(s => ({ name: s.name, required_score: s.requiredScore })),
          );
          if (exp?.explanation) notes[o._id] = exp.explanation;
        }),
      );
      setWhy(notes);
      toast('success', 'Opportunities reordered by semantic match to your profile.');
    } else {
      toast('info', 'AI service not reachable — start the AI service and try again.');
    }
    setSemanticBusy(false);
  };

  const toggleCompare = (id: string) => {
    setCompare(prev => {
      if (prev.includes(id)) return prev.filter(x => x !== id);
      if (prev.length >= 2) {
        toast('info', 'Compare is limited to two openings. Uncheck one first.');
        return prev;
      }
      return [...prev, id];
    });
  };

  const apply = async (id: string) => {
    if (!consent) {
      toast('error', 'Please consent to share your profile with this organisation.');
      return;
    }
    const loading = toast('loading', 'Submitting application…', 0);
    await new Promise(r => setTimeout(r, 700));
    if (!isDemo) {
      try {
        await api.post('/applications', { opportunityId: id });
      } catch {
        /* prototype still records locally */
      }
    }
    dismiss(loading);
    setApplied(a => [...a, id]);
    setSelected(null);
    setConsent(false);
    toast('success', 'Application submitted. Track it on the pipeline board.');
  };

  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader
        kicker="Industry requirement portal"
        title="Internships & placements"
        subtitle="Filter by city and multiple skills, save openings, or compare two side by side."
        actions={
          <div className="flex gap-2">
            <button
              type="button"
              className={`btn-secondary ${semanticRanked ? 'border-forest-400 text-forest-800' : ''}`}
              onClick={() => void runSemanticRank()}
              disabled={semanticBusy}
            >
              <Brain size={16} className={semanticBusy ? 'animate-pulse' : ''} />
              {semanticBusy ? 'Matching…' : semanticRanked ? 'Clear AI rank' : 'AI best match'}
            </button>
            <button
              type="button"
              className="btn-secondary"
              disabled={compare.length !== 2}
              onClick={() => setShowCompare(true)}
            >
              <GitCompare size={16} /> Compare {compare.length}/2
            </button>
          </div>
        }
      />
      <div className="mb-4 flex flex-wrap gap-2">
        {CITIES.map(c => (
          <button
            key={c}
            type="button"
            onClick={() => setCity(c)}
            className={`inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-semibold transition ${
              city === c ? 'bg-forest-700 text-white' : 'bg-white text-ink-700 hover:bg-cream-200'
            }`}
          >
            <MapPin size={12} /> {c}
          </button>
        ))}
      </div>
      <div className="mb-4 rounded-2xl border border-slate-200 bg-white p-4">
        <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-forest-600">Skills — select more than one</p>
          {skills.length > 0 && (
            <button type="button" className="text-xs font-semibold text-forest-700 hover:underline" onClick={() => setSkills([])}>
              Clear skills
            </button>
          )}
        </div>
        <SkillChipPicker options={SKILL_FILTERS} selected={skills} onChange={setSkills} />
      </div>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <input className="input" placeholder="Search hospital, skill, city…" value={query} onChange={e => setQuery(e.target.value)} />
        <div className="flex flex-wrap gap-2">
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
          <button
            type="button"
            onClick={() => setSavedOnly(v => !v)}
            className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
              savedOnly ? 'bg-saffron-50 text-saffron-700' : 'bg-white text-ink-600 hover:bg-cream-200'
            }`}
          >
            Saved ({saved.length})
          </button>
        </div>
      </div>
      {list.length === 0 ? (
        <EmptyState
          title={savedOnly ? 'No saved openings' : 'No matching openings'}
          body={
            savedOnly
              ? 'Bookmark opportunities with the ribbon icon. Saved items stay on this device.'
              : 'Try another city, hospital or filter. New AYUSH postings appear as industry publishes them.'
          }
        />
      ) : (
        <div className="grid gap-4">
          {list.map((o, i) => (
            <motion.article
              key={o._id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="card overflow-hidden p-0 transition hover:border-forest-200 hover:shadow-md"
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
                    {semanticRanked && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-cream-200 px-2 py-0.5 text-[11px] font-semibold text-ink-700">
                        <Brain size={11} /> #{semanticRanked.indexOf(o._id) + 1} AI rank
                      </span>
                    )}
                    <label className="ml-auto inline-flex items-center gap-1.5 text-xs text-ink-500">
                      <input type="checkbox" checked={compare.includes(o._id)} onChange={() => toggleCompare(o._id)} />
                      Compare
                    </label>
                  </div>
                  <h2 className="mt-2 text-xl font-semibold text-ink-900">{o.title}</h2>
                  <p className="mt-1 flex items-center gap-1 text-sm text-ink-500">
                    <MapPin size={14} /> {o.organization} · {o.location} · {o.workMode} · {o.duration}
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-ink-700">{o.description}</p>
                  {why[o._id] && <p className="mt-2 text-xs font-medium text-forest-800">{why[o._id]}</p>}
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
                  <div className="mt-3 flex gap-2">
                    <button
                      type="button"
                      className="btn-secondary flex-1 px-3"
                      onClick={() => toggleSave(o._id)}
                      aria-label={saved.includes(o._id) ? 'Unsave' : 'Save'}
                    >
                      {saved.includes(o._id) ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
                    </button>
                    {applied.includes(o._id) ? (
                      <p className="flex flex-1 items-center justify-center text-sm font-semibold text-forest-700">Applied ✓</p>
                    ) : (
                      <button
                        type="button"
                        className="btn-primary flex-[2]"
                        onClick={() => {
                          setConsent(false);
                          setSelected(o._id);
                        }}
                      >
                        Apply
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      )}

      <Modal
        open={!!current}
        onClose={() => setSelected(null)}
        kicker="DPDP consent"
        title={current ? `Apply · ${current.title}` : 'Apply'}
      >
        {current && (
          <>
            <p className="text-sm text-ink-500">
              {current.organization} · {current.location}
            </p>
            <label className="mt-4 flex items-start gap-2 text-sm text-ink-700">
              <input type="checkbox" checked={consent} onChange={e => setConsent(e.target.checked)} className="mt-1" />
              I consent to share my verified skill profile with {current.organization} (DPDP).
            </label>
            <div className="mt-5 flex gap-2">
              <button type="button" className="btn-primary" onClick={() => apply(current._id)}>
                Confirm application
              </button>
              <button type="button" className="btn-secondary" onClick={() => setSelected(null)}>
                Cancel
              </button>
            </div>
          </>
        )}
      </Modal>

      <Modal open={showCompare} onClose={() => setShowCompare(false)} kicker="Side by side" title="Compare openings">
        {pair.length === 2 ? (
          <div className="grid gap-4 sm:grid-cols-2">
            {pair.map(o => (
              <article key={o._id} className="rounded-xl border border-slate-200 p-4">
                <p className="text-xs font-bold uppercase text-saffron-700">{o.type}</p>
                <h3 className="mt-1 font-semibold text-ink-900">{o.title}</h3>
                <p className="mt-1 text-xs text-ink-500">
                  {o.organization} · {o.location}
                </p>
                <div className="mt-3">
                  <MatchBar score={o.matchScore} />
                </div>
                <p className="mt-2 text-sm font-medium text-forest-800">{o.stipend}</p>
                <p className="mt-1 text-xs text-ink-500">
                  {o.duration} · {o.workMode} · {o.numberOfPositions} seats
                </p>
                <ul className="mt-3 space-y-1 text-xs text-ink-700">
                  {o.requiredSkills.map(s => (
                    <li key={s.name}>
                      {s.name} · {s.requiredScore}+
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        ) : (
          <p className="text-sm text-ink-500">Select exactly two openings to compare.</p>
        )}
      </Modal>
    </div>
  );
}
