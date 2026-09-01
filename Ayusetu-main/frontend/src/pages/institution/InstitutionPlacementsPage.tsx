import { PageHeader, StatCard, StatusBadge } from '../../components/ui/Primitives';

export default function InstitutionPlacementsPage() {
  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader kicker="Placement cell" title="Confirmed offers" subtitle="Status moves to Placed when the student accepts an industry offer." />
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <StatCard label="Offers this cycle" value="64" />
        <StatCard label="Joined" value="51" />
        <StatCard label="Pending acceptance" value="13" />
      </div>
      <div className="card overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-200 bg-cream-100 text-xs uppercase tracking-wide text-ink-500">
            <tr>
              <th className="px-5 py-3 font-semibold">Student</th>
              <th className="px-5 py-3 font-semibold">Role</th>
              <th className="px-5 py-3 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['Priya Nair', 'MDNIY Yoga therapy', 'joined'],
              ['Arjun Patel', 'NIH Homoeopathy OPD', 'offered'],
              ['Ananya Sharma', 'AIIA Panchakarma', 'shortlisted'],
            ].map(([n, r, s]) => (
              <tr key={n} className="border-b border-slate-100 transition hover:bg-cream-100">
                <td className="px-5 py-3.5 font-medium">{n}</td>
                <td className="px-5 py-3.5 text-ink-500">{r}</td>
                <td className="px-5 py-3.5">
                  <StatusBadge status={s} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
