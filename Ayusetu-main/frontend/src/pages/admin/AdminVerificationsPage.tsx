import { useState } from 'react';
import { PageHeader } from '../../components/ui/Primitives';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { useToast } from '../../contexts/ToastContext';

const ROWS = [
  'Ananya Sharma — Panchakarma 120 hrs (AIIA)',
  'Fatima Noor — Unani pharmacy GMP (CCRUM)',
  'Karthik Selvam — Siddha OPD logbook (NIS)',
];

export default function AdminVerificationsPage() {
  const { toast } = useToast();
  const [rows, setRows] = useState(ROWS);
  const [approve, setApprove] = useState<string | null>(null);

  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader
        kicker="Verified credential layer"
        title="Pending authentications"
        subtitle="Institutions attest internships and certificates. Self-declared items never appear on public profiles by default."
      />
      <div className="space-y-3">
        {rows.map(row => (
          <div key={row} className="card flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
            <span className="text-sm font-medium text-ink-900">{row}</span>
            <div className="flex gap-2">
              <button type="button" className="btn-primary py-1.5 text-xs" onClick={() => setApprove(row)}>
                Approve
              </button>
              <button
                type="button"
                className="btn-secondary py-1.5 text-xs"
                onClick={() => toast('info', `Proof requested for ${row.split(' — ')[0]}`)}
              >
                Request proof
              </button>
            </div>
          </div>
        ))}
        {rows.length === 0 && <p className="card px-5 py-10 text-center text-sm text-ink-500">Queue clear — no pending authentications.</p>}
      </div>

      <ConfirmDialog
        open={!!approve}
        onClose={() => setApprove(null)}
        title="Approve this credential?"
        body={`${approve?.split(' — ')[0]} will show as institute-verified on their public skill profile.`}
        confirmLabel="Approve"
        onConfirm={() => {
          if (!approve) return;
          const name = approve.split(' — ')[0];
          setRows(r => r.filter(x => x !== approve));
          toast('success', `Approved: ${name}`);
        }}
      />
    </div>
  );
}
