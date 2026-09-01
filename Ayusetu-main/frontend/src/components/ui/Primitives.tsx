import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import type { ReactNode } from 'react';

export function PageHeader({
  kicker,
  title,
  subtitle,
  actions,
}: {
  kicker?: string;
  title: string;
  subtitle?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        {kicker && <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-forest-600">{kicker}</p>}
        <h1 className="font-serif text-3xl font-semibold tracking-tight text-ink-900 sm:text-[2.05rem]">{title}</h1>
        {subtitle && <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-500">{subtitle}</p>}
      </div>
      {actions}
    </div>
  );
}

export function MatchBar({ score }: { score: number }) {
  return (
    <div>
      <div className="mb-1 flex justify-between text-xs font-medium text-ink-500">
        <span>Match</span>
        <span className="text-forest-700">{score}%</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-slate-100">
        <motion.div
          className="h-full rounded-full bg-forest-600"
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(100, score)}%` }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const tone =
    status.includes('place') || status.includes('select') || status.includes('join')
      ? 'bg-emerald-50 text-emerald-800'
      : status.includes('interview') || status.includes('short')
        ? 'bg-forest-50 text-forest-800'
        : status.includes('gap') || status.includes('pending')
          ? 'bg-saffron-50 text-saffron-700'
          : 'bg-slate-100 text-ink-700';

  return (
    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${tone}`}>
      {status.replace(/_/g, ' ')}
    </span>
  );
}

export function StatCard({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="card-hover p-5">
      <p className="text-xs font-semibold uppercase tracking-wide text-ink-500">{label}</p>
      <p className="mt-2 font-serif text-3xl font-semibold tabular-nums text-forest-800">{value}</p>
      {hint && <p className="mt-1 text-xs text-ink-500">{hint}</p>}
    </div>
  );
}

export function EmptyState({ title, body }: { title: string; body: string }) {
  return (
    <div className="card px-6 py-14 text-center">
      <p className="font-semibold text-ink-900">{title}</p>
      <p className="mx-auto mt-2 max-w-md text-sm text-ink-500">{body}</p>
    </div>
  );
}

export function Modal({
  open,
  onClose,
  title,
  kicker,
  children,
  size = 'md',
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  kicker?: string;
  children: ReactNode;
  size?: 'md' | 'lg';
}) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-[2px]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            className={`max-h-[90vh] w-full overflow-y-auto rounded-2xl bg-white p-6 shadow-xl ring-1 ring-black/5 ${
              size === 'lg' ? 'max-w-2xl' : 'max-w-lg'
            }`}
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8 }}
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                {kicker && <p className="text-xs font-semibold uppercase tracking-wide text-forest-600">{kicker}</p>}
                <h2 id="modal-title" className="mt-1 font-serif text-xl font-semibold text-ink-900">
                  {title}
                </h2>
              </div>
              <button type="button" className="rounded-lg p-1 text-ink-500 hover:bg-slate-100" onClick={onClose} aria-label="Close">
                <X size={18} />
              </button>
            </div>
            <div className="mt-5">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

const AVATAR_TONES = ['bg-forest-600', 'bg-saffron-600', 'bg-forest-800', 'bg-saffron-700', 'bg-forest-500'];

export function Avatar({ name, size = 'md' }: { name: string; size?: 'sm' | 'md' | 'lg' }) {
  const initials = name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(p => p[0])
    .join('')
    .toUpperCase();
  const tone = AVATAR_TONES[name.charCodeAt(0) % AVATAR_TONES.length];
  const dim = size === 'lg' ? 'h-14 w-14 text-lg' : size === 'sm' ? 'h-8 w-8 text-[10px]' : 'h-10 w-10 text-xs';
  return (
    <div className={`flex shrink-0 items-center justify-center rounded-full font-bold text-white ${tone} ${dim}`}>{initials}</div>
  );
}

export function SkillChipPicker({
  options,
  selected,
  onChange,
}: {
  options: string[];
  selected: string[];
  onChange: (next: string[]) => void;
}) {
  const toggle = (skill: string) => {
    onChange(selected.includes(skill) ? selected.filter(s => s !== skill) : [...selected, skill]);
  };
  return (
    <div className="flex flex-wrap gap-2">
      {options.map(skill => {
        const on = selected.includes(skill);
        return (
          <button
            key={skill}
            type="button"
            onClick={() => toggle(skill)}
            className={`rounded-full border px-3 py-1.5 text-sm transition ${
              on ? 'border-forest-600 bg-forest-600 text-white' : 'border-slate-200 bg-white text-ink-700 hover:border-forest-300'
            }`}
          >
            {skill}
          </button>
        );
      })}
    </div>
  );
}
