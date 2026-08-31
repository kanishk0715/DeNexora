import { PageHeader } from '../../components/ui/Primitives';

export default function AdminUsersPage() {
  return (
    <div>
      <PageHeader kicker="Onboarding" title="Institutes & industry" subtitle="Phased access for NIA, CCRAS, NIH, NIS, NIUM and wellness enterprises." />
      <div className="card divide-y text-sm">
        {[
          ['National Institute of Ayurveda', 'Institution', 'Live'],
          ['All India Institute of Ayurveda', 'Institution', 'Live'],
          ['Kerala Ayurveda Ltd.', 'Industry', 'Verified'],
          ['CCRUM Hyderabad unit', 'Industry', 'Pending'],
        ].map(([n, t, s]) => (
          <div key={n} className="flex justify-between px-5 py-3">
            <span className="font-medium">{n}</span>
            <span className="text-ink-500">{t}</span>
            <span className="text-forest-700">{s}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
