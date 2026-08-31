import { PageHeader, StatusBadge, MatchBar } from '../../components/ui/Primitives';
import { DEMO_INDUSTRY_APPLICANTS } from '../../data/demo';

export default function IndustryApplicantsPage() {
  return (
    <div>
      <PageHeader
        kicker="Talent shortlist"
        title="Ranked applicants"
        subtitle="AI match uses verified skills first. Move candidates through interview to offer."
      />
      <div className="card overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="border-b border-stone-200 bg-cream-50 text-xs uppercase tracking-wide text-ink-500">
            <tr>
              <th className="px-4 py-3">Candidate</th>
              <th className="px-4 py-3">Institute</th>
              <th className="px-4 py-3">Skills</th>
              <th className="px-4 py-3 w-40">Match</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {DEMO_INDUSTRY_APPLICANTS.map(a => (
              <tr key={a.name} className="border-b border-stone-100">
                <td className="px-4 py-3 font-medium">{a.name}</td>
                <td className="px-4 py-3 text-ink-500">{a.college}</td>
                <td className="px-4 py-3">{a.skills}</td>
                <td className="px-4 py-3">
                  <MatchBar score={a.match} />
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={a.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
