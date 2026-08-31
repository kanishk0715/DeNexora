import { PageHeader } from '../../components/ui/Primitives';

export default function AdminUsersPage() {
  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader kicker="Onboarding" title="Institutes & industry" subtitle="Phased access for NIA, CCRAS, NIH, NIS, NIUM and wellness enterprises." />
      <div className="card overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-200 bg-cream-100 text-xs uppercase tracking-wide text-ink-500">
            <tr>
              <th className="px-5 py-3 font-semibold">Organisation</th>
              <th className="px-5 py-3 font-semibold">Type</th>
              <th className="px-5 py-3 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['National Institute of Ayurveda', 'Institution', 'Live'],
              ['All India Institute of Ayurveda', 'Institution', 'Live'],
              ['Kerala Ayurveda Ltd.', 'Industry', 'Verified'],
              ['CCRUM Hyderabad unit', 'Industry', 'Pending'],
            ].map(([n, t, s]) => (
              <tr key={n} className="border-b border-slate-100 transition hover:bg-cream-100">
                <td className="px-5 py-3.5 font-medium">{n}</td>
                <td className="px-5 py-3.5 text-ink-500">{t}</td>
                <td className="px-5 py-3.5 font-semibold text-forest-700">{s}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
