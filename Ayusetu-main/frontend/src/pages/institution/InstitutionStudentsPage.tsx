import { PageHeader, StatusBadge } from '../../components/ui/Primitives';
import { DEMO_STUDENTS } from '../../data/demo';

export default function InstitutionStudentsPage() {
  return (
    <div>
      <PageHeader
        kicker="Unified student profiles"
        title="Cohort directory"
        subtitle="Verify certificates so industry match scores trust your students’ skills."
      />
      <div className="card overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="border-b bg-cream-50 text-xs uppercase tracking-wide text-ink-500">
            <tr>
              <th className="px-4 py-3">Student</th>
              <th className="px-4 py-3">Stream</th>
              <th className="px-4 py-3">Year</th>
              <th className="px-4 py-3">Readiness</th>
              <th className="px-4 py-3">Placement</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {DEMO_STUDENTS.map(s => (
              <tr key={s.name} className="border-b border-stone-100">
                <td className="px-4 py-3 font-medium">{s.name}</td>
                <td className="px-4 py-3">{s.stream}</td>
                <td className="px-4 py-3">{s.year}</td>
                <td className="px-4 py-3">{s.readiness}</td>
                <td className="px-4 py-3">
                  <StatusBadge status={s.status.toLowerCase().split(' ')[0]} />
                </td>
                <td className="px-4 py-3">
                  <button type="button" className="text-xs font-semibold text-forest-700">
                    Verify credentials
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
