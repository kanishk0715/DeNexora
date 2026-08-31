import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Briefcase, Search } from 'lucide-react';
import { DEMO_OPPORTUNITIES } from '../data/demo';
import { useAuth } from '../contexts/AuthContext';

function isTypingTarget(el: EventTarget | null) {
  if (!(el instanceof HTMLElement)) return false;
  const tag = el.tagName;
  return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || el.isContentEditable;
}

export function CommandPalette() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return DEMO_OPPORTUNITIES.filter(
      o =>
        !q ||
        o.title.toLowerCase().includes(q) ||
        o.organization.toLowerCase().includes(q) ||
        o.location.toLowerCase().includes(q) ||
        o.requiredSkills.some(s => s.name.toLowerCase().includes(q)),
    ).slice(0, 8);
  }, [query]);

  const openPalette = () => {
    setOpen(true);
    setQuery('');
    setActive(0);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === '/' && !open && !e.metaKey && !e.ctrlKey && !e.altKey) {
        if (isTypingTarget(e.target)) return;
        e.preventDefault();
        openPalette();
      }
      if (e.key === 'Escape') setOpen(false);
    };
    const onCustom = () => openPalette();
    window.addEventListener('keydown', onKey);
    window.addEventListener('ayusetu-palette', onCustom);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('ayusetu-palette', onCustom);
    };
  }, [open]);

  useEffect(() => {
    if (open) {
      const t = window.setTimeout(() => inputRef.current?.focus(), 30);
      return () => window.clearTimeout(t);
    }
  }, [open]);

  useEffect(() => {
    setActive(0);
  }, [query]);

  const dest = () => {
    if (!user) return '/?start=1';
    if (user.role === 'industry') return '/industry/opportunities';
    if (user.role === 'student' || user.role === 'academician') return '/opportunities';
    if (user.role === 'institution') return '/institution/placements';
    return '/admin/analytics';
  };

  const go = (id?: string) => {
    setOpen(false);
    navigate(dest(), { state: id ? { highlight: id } : undefined });
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[80] flex items-start justify-center bg-slate-900/40 px-4 pt-[12vh]" onClick={() => setOpen(false)}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Search internships"
        className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-card"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center gap-2 border-b border-slate-100 px-4 py-3">
          <Search size={16} className="text-ink-500" />
          <input
            ref={inputRef}
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'ArrowDown') {
                e.preventDefault();
                setActive(i => Math.min(results.length - 1, i + 1));
              }
              if (e.key === 'ArrowUp') {
                e.preventDefault();
                setActive(i => Math.max(0, i - 1));
              }
              if (e.key === 'Enter' && results[active]) go(results[active]._id);
            }}
            placeholder="Search internships, institutes, cities…"
            className="flex-1 bg-transparent text-sm text-ink-900 outline-none placeholder:text-ink-500"
          />
          <kbd className="rounded border border-slate-200 bg-cream-100 px-1.5 py-0.5 text-[10px] font-semibold text-ink-500">ESC</kbd>
        </div>
        <ul className="max-h-80 overflow-y-auto py-2">
          {results.length === 0 && <li className="px-4 py-6 text-center text-sm text-ink-500">No openings match that search.</li>}
          {results.map((o, i) => (
            <li key={o._id}>
              <button
                type="button"
                className={`flex w-full items-start gap-3 px-4 py-3 text-left ${i === active ? 'bg-forest-50' : 'hover:bg-cream-100'}`}
                onMouseEnter={() => setActive(i)}
                onClick={() => go(o._id)}
              >
                <Briefcase size={16} className="mt-0.5 shrink-0 text-forest-700" />
                <span>
                  <span className="block text-sm font-semibold text-ink-900">{o.title}</span>
                  <span className="mt-0.5 block text-xs text-ink-500">
                    {o.organization} · {o.location}
                  </span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export function SearchTrigger() {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event('ayusetu-palette'))}
      className="hidden items-center gap-2 rounded-xl border border-slate-200 bg-cream-100 px-3 py-1.5 text-sm text-ink-500 hover:border-forest-200 md:flex"
      aria-label="Search internships"
    >
      <Search size={14} />
      <span>Search internships</span>
      <kbd className="rounded border border-slate-200 bg-white px-1.5 py-0.5 text-[10px] font-semibold">/</kbd>
    </button>
  );
}
