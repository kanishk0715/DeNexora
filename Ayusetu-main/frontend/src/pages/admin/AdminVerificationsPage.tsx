import { PageHeader } from '../../components/ui/Primitives';

export default function AdminVerificationsPage() {
  return (
    <div>
      <PageHeader
        kicker="Verified credential layer"
        title="Pending authentications"
        subtitle="Institutions attest internships and certificates. Self-declared items never appear on public profiles by default."
      />
      <div className="space-y-3">
        {[
          'Ananya Sharma — Panchakarma 120 hrs (AIIA)',
          'Fatima Noor — Unani pharmacy GMP (CCRUM)',
          'Karthik Selvam — Siddha OPD logbook (NIS)',
        ].map(row => (
          <div key={row} className="card flex items-center justify-between p-4 text-sm">
            <span>{row}</span>
            <div className="flex gap-2">
              <button type="button" className="btn-primary py-1.5 text-xs">
                Approve
              </button>
              <button type="button" className="btn-secondary py-1.5 text-xs">
                Request proof
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
