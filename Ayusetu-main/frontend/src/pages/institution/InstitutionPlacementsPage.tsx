import { PageHeader, StatCard } from '../../components/ui/Primitives';

export default function InstitutionPlacementsPage() {
  return (
    <div>
      <PageHeader kicker="Placement cell" title="Confirmed offers" subtitle="Status moves to Placed when the student accepts an industry offer." />
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <StatCard label="Offers this cycle" value="64" />
        <StatCard label="Joined" value="51" />
        <StatCard label="Pending acceptance" value="13" />
      </div>
      <div className="card divide-y">
        {[
          ['Priya Nair', 'MDNIY Yoga therapy', 'Joined'],
          ['Arjun Patel', 'NIH Homoeopathy OPD', 'Offered'],
          ['Ananya Sharma', 'AIIA Panchakarma', 'Shortlisted'],
        ].map(([n, r, s]) => (
          <div key={n} className="flex justify-between px-5 py-3 text-sm">
            <span className="font-medium">{n}</span>
            <span className="text-ink-500">{r}</span>
            <span className="font-semibold text-forest-700">{s}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
