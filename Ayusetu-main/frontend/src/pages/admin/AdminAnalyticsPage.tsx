import { PageHeader, StatCard } from '../../components/ui/Primitives';
import { STATE_PLACEMENTS } from '../../data/demo';
import { StatePulseGrid } from '../../components/ministry/StatePulseGrid';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export default function AdminAnalyticsPage() {
  return (
    <div>
      <PageHeader
        kicker="Ministry analytics"
        title="National AYUSH placement pulse"
        subtitle="State tiles first — NIA / CCRAS institutes, then nationwide internships and jobs."
      />
      <div className="mb-6 grid gap-4 sm:grid-cols-4">
        <StatCard label="States reporting" value={String(STATE_PLACEMENTS.length)} />
        <StatCard label="Skill ontology tags" value="240" />
        <StatCard label="Verified credentials" value="31.4k" />
        <StatCard label="Open requirements" value="1,042" />
      </div>
      <StatePulseGrid />
      <div className="card mt-6 p-5">
        <h2 className="mb-4 font-semibold text-forest-900">Internships vs jobs (top states)</h2>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={STATE_PLACEMENTS.slice(0, 8)}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0e6d8" />
            <XAxis dataKey="state" tick={{ fontSize: 11 }} interval={0} angle={-20} textAnchor="end" height={70} />
            <YAxis />
            <Tooltip />
            <Bar dataKey="internships" fill="#16553d" name="Internships" />
            <Bar dataKey="jobs" fill="#c45c26" name="Jobs" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
