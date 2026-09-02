import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Bookmark, BookmarkCheck, Building2, Calendar, ExternalLink, Landmark, ScrollText } from 'lucide-react';
import { PageHeader, EmptyState } from '../../components/ui/Primitives';
import { useToast } from '../../contexts/ToastContext';
import {
  AYUSH_DESK,
  AYUSH_DESK_TRACKS,
  type AyushDeskItem,
  type AyushDeskKind,
  type AyushDeskTrack,
} from '../../data/ayushExamsSchemes';

const SAVED_KEY = 'ayusetu-saved-ayush-desk';

function loadSaved(): string[] {
  try {
    return JSON.parse(localStorage.getItem(SAVED_KEY) || '[]');
  } catch {
    return [];
  }
}

const KINDS: { id: AyushDeskKind | 'all'; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'exam', label: 'Exams' },
  { id: 'scheme', label: 'Govt schemes' },
];

function KindBadge({ kind }: { kind: AyushDeskKind }) {
  return (
    <span
      className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
        kind === 'exam' ? 'bg-forest-50 text-forest-800' : 'bg-saffron-50 text-saffron-800'
      }`}
    >
      {kind === 'exam' ? 'Exam' : 'Scheme'}
    </span>
  );
}

function DeskCard({
  item,
  saved,
  onToggle,
}: {
  item: AyushDeskItem;
  saved: boolean;
  onToggle: () => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="card-hover flex flex-col p-5"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <KindBadge kind={item.kind} />
            <span className="text-[11px] font-medium text-ink-500">{item.authority}</span>
          </div>
          <h2 className="mt-2 font-serif text-lg font-semibold text-ink-900">{item.title}</h2>
          <p className="mt-1 text-sm leading-relaxed text-ink-600">{item.short}</p>
        </div>
        <button
          type="button"
          className="shrink-0 rounded-lg p-2 text-forest-800 hover:bg-forest-50"
          aria-label={saved ? 'Remove bookmark' : 'Save'}
          onClick={onToggle}
        >
          {saved ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
        </button>
      </div>
      <p className="mt-3 flex items-start gap-2 text-xs text-ink-500">
        <Calendar size={14} className="mt-0.5 shrink-0 text-forest-700" />
        {item.window}
      </p>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {item.tags.map(tag => (
          <span key={tag} className="rounded-full bg-cream-100 px-2 py-0.5 text-[11px] font-medium text-forest-800">
            {tag}
          </span>
        ))}
      </div>
      {open && (
        <div className="mt-4 space-y-3 border-t border-forest-100 pt-4 text-sm">
          <p>
            <span className="font-semibold text-ink-800">Who it is for. </span>
            <span className="text-ink-600">{item.eligibility}</span>
          </p>
          <p>
            <span className="font-semibold text-ink-800">Why it matters. </span>
            <span className="text-ink-600">{item.benefit}</span>
          </p>
        </div>
      )}
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <button type="button" className="text-xs font-semibold text-forest-800 hover:underline" onClick={() => setOpen(v => !v)}>
          {open ? 'Hide details' : 'Eligibility & benefit'}
        </button>
        <a
          href={item.officialUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="ml-auto inline-flex items-center gap-1 rounded-md bg-forest-800 px-3 py-1.5 text-xs font-semibold text-cream-50 hover:bg-forest-900"
        >
          Official site
          <ExternalLink size={12} />
        </a>
      </div>
    </motion.article>
  );
}

export default function ExamsSchemesPage() {
  const { toast } = useToast();
  const [kind, setKind] = useState<AyushDeskKind | 'all'>('all');
  const [track, setTrack] = useState<AyushDeskTrack | 'all'>('all');
  const [query, setQuery] = useState('');
  const [savedOnly, setSavedOnly] = useState(false);
  const [saved, setSaved] = useState<string[]>(loadSaved);

  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    return AYUSH_DESK.filter(item => {
      const k = kind === 'all' || item.kind === kind;
      const t = track === 'all' || item.track === track;
      const s = !savedOnly || saved.includes(item.id);
      const hit =
        !q ||
        item.title.toLowerCase().includes(q) ||
        item.short.toLowerCase().includes(q) ||
        item.authority.toLowerCase().includes(q) ||
        item.tags.some(tag => tag.toLowerCase().includes(q));
      return k && t && s && hit;
    });
  }, [kind, track, query, savedOnly, saved]);

  const examCount = AYUSH_DESK.filter(i => i.kind === 'exam').length;
  const schemeCount = AYUSH_DESK.filter(i => i.kind === 'scheme').length;

  const toggleSave = (id: string) => {
    setSaved(prev => {
      const next = prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id];
      localStorage.setItem(SAVED_KEY, JSON.stringify(next));
      toast('success', prev.includes(id) ? 'Removed from saved' : 'Saved to your desk');
      return next;
    });
  };

  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader
        kicker="Student desk"
        title="Ayurveda exams & government schemes"
        subtitle="National tests, counselling portals and Ministry of Ayush missions that BAMS students actually use. Dates move each year — always confirm on the official site."
      />

      <div className="mb-6 grid gap-3 sm:grid-cols-2">
        <div className="card flex items-center gap-3 p-4">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-forest-50 text-forest-800">
            <ScrollText size={18} />
          </span>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-ink-500">Exams & counselling</p>
            <p className="font-serif text-xl font-semibold text-ink-900">{examCount} listed</p>
          </div>
        </div>
        <div className="card flex items-center gap-3 p-4">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-saffron-50 text-saffron-800">
            <Landmark size={18} />
          </span>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-ink-500">Govt schemes</p>
            <p className="font-serif text-xl font-semibold text-ink-900">{schemeCount} listed</p>
          </div>
        </div>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        {KINDS.map(k => (
          <button
            key={k.id}
            type="button"
            onClick={() => setKind(k.id)}
            className={`rounded-full px-3 py-1.5 text-sm font-semibold transition ${
              kind === k.id ? 'bg-forest-800 text-white' : 'bg-white text-ink-700 ring-1 ring-slate-200 hover:bg-cream-100'
            }`}
          >
            {k.label}
          </button>
        ))}
        <button
          type="button"
          onClick={() => setSavedOnly(v => !v)}
          className={`ml-auto rounded-full px-3 py-1.5 text-sm font-semibold transition ${
            savedOnly ? 'bg-saffron-50 text-saffron-800 ring-1 ring-saffron-200' : 'bg-white text-ink-600 ring-1 ring-slate-200'
          }`}
        >
          Saved only
        </button>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        {AYUSH_DESK_TRACKS.map(t => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTrack(t.id)}
            className={`rounded-full px-3 py-1 text-xs font-medium transition ${
              track === t.id ? 'bg-forest-700 text-white' : 'bg-cream-100 text-ink-600 hover:bg-cream-200'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <input
        className="input mb-6"
        placeholder="Search AIAPGET, NAM, scholarship, CCRAS…"
        value={query}
        onChange={e => setQuery(e.target.value)}
      />

      {list.length === 0 ? (
        <EmptyState
          title="No matching items"
          body="Clear filters or search another term. Bookmarks stay on this device."
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {list.map(item => (
            <DeskCard key={item.id} item={item} saved={saved.includes(item.id)} onToggle={() => toggleSave(item.id)} />
          ))}
        </div>
      )}

      <p className="mt-8 flex items-start gap-2 text-xs leading-relaxed text-ink-500">
        <Building2 size={14} className="mt-0.5 shrink-0" />
        AyuSetu lists public programmes for orientation. Notifications, fees and seat matrices are issued only by NTA,
        AACCC, NCISM, CCRAS, NMPB and the Ministry of Ayush — open Official site before you apply.
      </p>
    </div>
  );
}
