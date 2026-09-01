import { useMemo, useState } from 'react';
import { PageHeader, StatusBadge, Avatar, Modal } from '../../components/ui/Primitives';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { DEMO_STUDENTS } from '../../data/demo';
import { useToast } from '../../contexts/ToastContext';
import { BadgeCheck } from 'lucide-react';

const STREAMS = ['All', 'BAMS', 'BNYS', 'BUMS', 'BSMS', 'BHMS'];

type Student = (typeof DEMO_STUDENTS)[number];
type Cred = Student['credentials'][number];

export default function InstitutionStudentsPage() {
  const { toast } = useToast();
  const [query, setQuery] = useState('');
  const [stream, setStream] = useState('All');
  const [rows, setRows] = useState(DEMO_STUDENTS);
  const [who, setWho] = useState<Student | null>(null);
  const [pending, setPending] = useState<{ student: string; cred: Cred } | null>(null);

  const list = useMemo(() => {
    const q = query.toLowerCase();
    return rows.filter(s => {
      const hit = !q || s.name.toLowerCase().includes(q) || s.city.toLowerCase().includes(q);
      return hit && (stream === 'All' || s.stream === stream);
    });
  }, [rows, query, stream]);

  const live = who ? rows.find(s => s.name === who.name) ?? who : null;

  const verify = (studentName: string, credId: string) => {
    setRows(prev =>
      prev.map(s =>
        s.name === studentName
          ? { ...s, credentials: s.credentials.map(c => (c.id === credId ? { ...c, status: 'verified' as const } : c)) }
          : s,
      ),
    );
    toast('success', 'Credential verified. Industry match will trust this skill.');
  };

  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader
        kicker="Unified student profiles"
        title="Cohort directory"
        subtitle="Search by name, filter by stream, and attest certificates so industry match scores trust your students."
      />

      <div className="mb-4">
        <input className="input max-w-sm" placeholder="Search student or city" value={query} onChange={e => setQuery(e.target.value)} />
      </div>
      <div className="mb-4 flex flex-wrap gap-2">
        {STREAMS.map(s => (
          <button
            key={s}
            type="button"
            onClick={() => setStream(s)}
            className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
              stream === s ? 'bg-forest-700 text-white' : 'bg-white text-ink-700 ring-1 ring-slate-200 hover:bg-cream-100'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="card overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="border-b border-slate-200 bg-cream-100 text-xs uppercase tracking-wide text-ink-500">
            <tr>
              <th className="px-4 py-3 font-semibold">Student</th>
              <th className="px-4 py-3 font-semibold">Stream</th>
              <th className="px-4 py-3 font-semibold">Year</th>
              <th className="px-4 py-3 font-semibold">Readiness</th>
              <th className="px-4 py-3 font-semibold">Placement</th>
              <th className="px-4 py-3 font-semibold" />
            </tr>
          </thead>
          <tbody>
            {list.map(s => (
              <tr key={s.name} className="border-b border-slate-100 transition hover:bg-cream-100">
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-3">
                    <Avatar name={s.name} size="sm" />
                    <div>
                      <p className="font-medium text-ink-900">{s.name}</p>
                      <p className="text-xs text-ink-500">{s.city}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3.5">{s.stream}</td>
                <td className="px-4 py-3.5">{s.year}</td>
                <td className="px-4 py-3.5 font-semibold text-forest-800">{s.readiness}</td>
                <td className="px-4 py-3.5">
                  <StatusBadge status={s.status.toLowerCase().split(' ')[0]} />
                </td>
                <td className="px-4 py-3.5">
                  <button type="button" className="text-xs font-semibold text-forest-700 hover:underline" onClick={() => setWho(s)}>
                    Verify credentials
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {list.length === 0 && <p className="px-4 py-10 text-center text-sm text-ink-500">No students match this search.</p>}
      </div>

      <Modal open={!!live} onClose={() => setWho(null)} kicker={live ? `${live.stream} · ${live.year}` : ''} title={live?.name ?? 'Credentials'}>
        {live && (
          <ul className="space-y-3">
            {live.credentials.map(c => (
              <li key={c.id} className="flex items-center justify-between gap-3 rounded-xl border border-slate-100 p-3">
                <div>
                  <p className="text-sm font-semibold text-ink-900">{c.title}</p>
                  <p className="text-xs text-ink-500">{c.issuer}</p>
                </div>
                {c.status === 'verified' ? (
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-forest-700">
                    <BadgeCheck size={14} /> Verified
                  </span>
                ) : (
                  <button
                    type="button"
                    className="btn-primary py-1.5 text-xs"
                    onClick={() => setPending({ student: live.name, cred: c })}
                  >
                    Verify
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
      </Modal>

      <ConfirmDialog
        open={!!pending}
        onClose={() => setPending(null)}
        title={`Verify ${pending?.cred.title}?`}
        body="This attestation is stored on the student’s profile. Industry match scores will treat the skill as institute-verified."
        confirmLabel="Verify credential"
        onConfirm={() => {
          if (pending) verify(pending.student, pending.cred.id);
        }}
      />
    </div>
  );
}
