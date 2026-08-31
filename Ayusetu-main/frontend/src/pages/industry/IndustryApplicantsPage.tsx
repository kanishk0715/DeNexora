import { useMemo, useState } from 'react';
import { PageHeader, StatusBadge, MatchBar, Avatar } from '../../components/ui/Primitives';
import { SlideOver } from '../../components/ui/SlideOver';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { DEMO_INDUSTRY_APPLICANTS } from '../../data/demo';
import { useToast } from '../../contexts/ToastContext';
import { BadgeCheck, MapPin } from 'lucide-react';

const STATUSES = [
  { id: 'all', label: 'All' },
  { id: 'applied', label: 'Applied' },
  { id: 'under_review', label: 'Review' },
  { id: 'shortlisted', label: 'Shortlisted' },
  { id: 'interview', label: 'Interview' },
];

type Applicant = (typeof DEMO_INDUSTRY_APPLICANTS)[number];

export default function IndustryApplicantsPage() {
  const { toast } = useToast();
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('all');
  const [college, setCollege] = useState('All');
  const [rows, setRows] = useState(DEMO_INDUSTRY_APPLICANTS);
  const [selected, setSelected] = useState<Applicant | null>(null);
  const [passWho, setPassWho] = useState<Applicant | null>(null);

  const institutes = useMemo(() => ['All', ...Array.from(new Set(DEMO_INDUSTRY_APPLICANTS.map(a => a.college)))], []);

  const list = useMemo(() => {
    const q = query.toLowerCase();
    return rows.filter(a => {
      const hit = !q || a.name.toLowerCase().includes(q) || a.skills.some(s => s.toLowerCase().includes(q));
      const st = status === 'all' || a.status === status;
      const c = college === 'All' || a.college === college;
      return hit && st && c;
    });
  }, [rows, query, status, college]);

  const current = selected ? rows.find(a => a.id === selected.id) ?? selected : null;

  const setStatusFor = (id: string, next: Applicant['status'], message: string) => {
    setRows(prev => prev.map(a => (a.id === id ? { ...a, status: next } : a)));
    toast('success', message);
  };

  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader
        kicker="Talent shortlist"
        title="Ranked applicants"
        subtitle="AI match uses verified skills first. Open a profile to shortlist, interview or pass."
      />

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <input
          className="input sm:max-w-xs"
          placeholder="Search name or skill"
          value={query}
          onChange={e => setQuery(e.target.value)}
        />
        <select className="input sm:max-w-[14rem]" value={college} onChange={e => setCollege(e.target.value)}>
          {institutes.map(c => (
            <option key={c}>{c}</option>
          ))}
        </select>
      </div>
      <div className="mb-4 flex flex-wrap gap-2">
        {STATUSES.map(s => (
          <button
            key={s.id}
            type="button"
            onClick={() => setStatus(s.id)}
            className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
              status === s.id ? 'bg-forest-700 text-white' : 'bg-white text-ink-700 ring-1 ring-slate-200 hover:bg-cream-100'
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      <div className="card overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="border-b border-slate-200 bg-cream-100 text-xs uppercase tracking-wide text-ink-500">
            <tr>
              <th className="px-4 py-3 font-semibold">Candidate</th>
              <th className="px-4 py-3 font-semibold">Institute</th>
              <th className="px-4 py-3 font-semibold">Skills</th>
              <th className="w-40 px-4 py-3 font-semibold">Match</th>
              <th className="px-4 py-3 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody>
            {list.map(a => (
              <tr
                key={a.id}
                className="cursor-pointer border-b border-slate-100 transition hover:bg-cream-100"
                onClick={() => setSelected(a)}
              >
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-3">
                    <Avatar name={a.name} size="sm" />
                    <div>
                      <p className="font-medium text-ink-900">{a.name}</p>
                      <p className="text-xs text-ink-500">
                        {a.stream} · {a.year}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3.5 text-ink-500">{a.college}</td>
                <td className="px-4 py-3.5">
                  <div className="flex flex-wrap gap-1">
                    {a.skills.slice(0, 2).map(s => (
                      <span key={s} className="rounded-full bg-cream-100 px-2 py-0.5 text-[11px] text-ink-700">
                        {s}
                      </span>
                    ))}
                    {a.skills.length > 2 && <span className="text-[11px] text-ink-500">+{a.skills.length - 2}</span>}
                  </div>
                </td>
                <td className="px-4 py-3.5">
                  <MatchBar score={a.match} />
                </td>
                <td className="px-4 py-3.5">
                  <StatusBadge status={a.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {list.length === 0 && <p className="px-4 py-10 text-center text-sm text-ink-500">No applicants match these filters.</p>}
      </div>

      <SlideOver
        open={!!current}
        onClose={() => setSelected(null)}
        kicker={current?.appliedFor}
        title={current?.name ?? ''}
        footer={
          current ? (
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                className="btn-primary"
                onClick={() => setStatusFor(current.id, 'shortlisted', `${current.name} shortlisted.`)}
              >
                Shortlist
              </button>
              <button
                type="button"
                className="btn-secondary"
                onClick={() => setStatusFor(current.id, 'interview', `Interview marked for ${current.name}.`)}
              >
                Interview
              </button>
              <button type="button" className="text-sm font-semibold text-red-700 hover:underline" onClick={() => setPassWho(current)}>
                Pass
              </button>
            </div>
          ) : null
        }
      >
        {current && (
          <div>
            <div className="flex items-center gap-4">
              <Avatar name={current.name} size="lg" />
              <div>
                <p className="font-semibold text-ink-900">{current.college}</p>
                <p className="mt-1 flex items-center gap-1 text-xs text-ink-500">
                  <MapPin size={12} /> {current.city}
                </p>
                {current.verified && (
                  <p className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-forest-700">
                    <BadgeCheck size={14} /> Institute-verified hours
                  </p>
                )}
              </div>
            </div>
            <div className="mt-5">
              <MatchBar score={current.match} />
            </div>
            <p className="mt-5 text-sm leading-relaxed text-ink-700">{current.about}</p>
            <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-ink-500">Skills</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {current.skills.map(s => (
                <span key={s} className="rounded-full bg-forest-50 px-3 py-1 text-xs font-medium text-forest-800">
                  {s}
                </span>
              ))}
            </div>
            <dl className="mt-5 grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-xl bg-cream-100 p-3">
                <dt className="text-xs text-ink-500">Clinical hours</dt>
                <dd className="mt-1 font-semibold text-ink-900">{current.hours}</dd>
              </div>
              <div className="rounded-xl bg-cream-100 p-3">
                <dt className="text-xs text-ink-500">Contact</dt>
                <dd className="mt-1 truncate font-semibold text-ink-900">{current.email}</dd>
              </div>
            </dl>
          </div>
        )}
      </SlideOver>

      <ConfirmDialog
        open={!!passWho}
        onClose={() => setPassWho(null)}
        danger
        title={`Pass on ${passWho?.name}?`}
        body="They will drop out of this shortlist. You can still find them later under Applied."
        confirmLabel="Pass candidate"
        onConfirm={() => {
          if (passWho) setStatusFor(passWho.id, 'applied', `${passWho.name} moved back to applied.`);
          setPassWho(null);
        }}
      />
    </div>
  );
}
