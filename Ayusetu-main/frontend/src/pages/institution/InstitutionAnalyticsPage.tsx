import { PageHeader, StatCard } from '../../components/ui/Primitives';
import { SKILL_DEMAND } from '../../data/demo';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export default function InstitutionAnalyticsPage() {
  return (
    <div>
      <PageHeader
        kicker="Institution & ministry analytics"
        title="Skill-gap intelligence"
        subtitle="Use live industry demand to guide curriculum — the core of SIH 26044."
      />
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <StatCard label="Largest gap" value="Documentation" hint="Industry 121 vs supply 54" />
        <StatCard label="Surplus skill" value="Yoga therapy" hint="Supply exceeds demand" />
        <StatCard label="Export" value="CSV / PDF" hint="Ready for IQAC / ministry" />
      </div>
      <div className="card p-5">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={SKILL_DEMAND}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e7e5e4" />
            <XAxis dataKey="skill" tick={{ fontSize: 11 }} interval={0} angle={-16} textAnchor="end" height={72} />
            <YAxis />
            <Tooltip />
            <Bar dataKey="demand" fill="#c45c26" name="Demand" />
            <Bar dataKey="supply" fill="#143d32" name="Supply" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
