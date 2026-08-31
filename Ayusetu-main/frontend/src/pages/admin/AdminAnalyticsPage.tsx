import { PageHeader, StatCard } from '../../components/ui/Primitives';
import { STATE_PLACEMENTS } from '../../data/demo';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export default function AdminAnalyticsPage() {
  return (
    <div>
      <PageHeader
        kicker="Ministry analytics"
        title="National AYUSH placement pulse"
        subtitle="Phased rollout view — NIA / CCRAS institutes first, then nationwide."
      />
      <div className="mb-6 grid gap-4 sm:grid-cols-4">
        <StatCard label="States reporting" value="18" />
        <StatCard label="Skill ontology tags" value="240" />
        <StatCard label="Verified credentials" value="31.4k" />
        <StatCard label="Open requirements" value="1,042" />
      </div>
      <div className="card p-5">
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={STATE_PLACEMENTS}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e7e5e4" />
            <XAxis dataKey="state" tick={{ fontSize: 11 }} interval={0} angle={-20} textAnchor="end" height={70} />
            <YAxis />
            <Tooltip />
            <Bar dataKey="internships" fill="#16553d" name="Internships" />
            <Bar dataKey="jobs" fill="#e8b86d" name="Jobs" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
