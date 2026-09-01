import { PageHeader, StatCard } from '../../components/ui/Primitives';
import { STATE_PLACEMENTS, DEMO_OPPORTUNITIES } from '../../data/demo';
import { StatePulseGrid } from '../../components/ministry/StatePulseGrid';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { useEffect, useState } from 'react';
import { fetchSkillDemand } from '../../lib/api';

export default function AdminAnalyticsPage() {
  const [demand, setDemand] = useState<{ skill: string; postings: number }[]>([]);

  useEffect(() => {
    void fetchSkillDemand(
      DEMO_OPPORTUNITIES.map(o => ({
        id: o._id,
        required_skills: o.requiredSkills.map(s => ({ name: s.name })),
      })),
    ).then(d => {
      if (d?.top_skills) setDemand(d.top_skills);
    });
  }, []);
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
      {demand.length > 0 && (
        <div className="card mt-6 p-5">
          <h2 className="mb-3 font-semibold text-forest-900">NLP skill demand (from live postings)</h2>
          <ul className="flex flex-wrap gap-2">
            {demand.map(s => (
              <li key={s.skill} className="rounded-full bg-forest-50 px-3 py-1 text-xs font-medium text-forest-800">
                {s.skill} · {s.postings}
              </li>
            ))}
          </ul>
        </div>
      )}
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
