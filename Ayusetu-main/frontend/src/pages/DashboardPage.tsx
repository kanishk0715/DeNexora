import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { PageHeader, StatCard, MatchBar, StatusBadge } from '../components/ui/Primitives';
import { ReadinessRing } from '../components/ui/ReadinessRing';
import { DEMO_APPLICATIONS, DEMO_OPPORTUNITIES, DEMO_SKILLS, SKILL_DEMAND, STATE_PLACEMENTS } from '../data/demo';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export default function DashboardPage() {
  const { user } = useAuth();
  if (!user) return null;

  if (user.role === 'student') return <StudentDash name={user.name} />;
  if (user.role === 'industry') return <IndustryDash />;
  if (user.role === 'institution') return <InstitutionDash />;
  if (user.role === 'admin') return <MinistryDash />;
  return <FacultyDash name={user.name} />;
}

function StudentDash({ name }: { name: string }) {
  const top = DEMO_OPPORTUNITIES.slice(0, 3);
  return (
    <div>
      <PageHeader
        kicker="Student workspace"
        title={`Namaste, ${name.split(' ')[0]}`}
        subtitle="Your verified AYUSH profile, live match scores and placement pipeline."
      />
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="card relative overflow-hidden p-6 lg:row-span-1">
          <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-forest-100" />
          <ReadinessRing value={84} />
          <p className="mt-2 text-center text-xs text-ink-500">Weighted clinical + documentation score</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:col-span-2">
          <StatCard label="Verified skills" value="4 / 6" hint="Institution credential layer" />
          <StatCard label="Active applications" value="3" hint="Interview on Friday" />
          <StatCard label="Top match" value="92%" hint="AIIA Panchakarma intern" />
          <StatCard label="Skill gaps" value="2" hint="Docs + Nadi Pariksha" />
        </div>
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <section className="card p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-serif text-lg text-forest-900">Recommended internships</h2>
            <Link to="/opportunities" className="text-sm font-semibold text-forest-700 hover:underline">
              View all
            </Link>
          </div>
          <div className="space-y-3">
            {top.map(o => (
              <Link
                key={o._id}
                to="/opportunities"
                className="block rounded-xl border border-slate-100 bg-cream-100 p-4 transition hover:border-forest-200 hover:bg-white"
              >
                <p className="font-medium text-ink-900">{o.title}</p>
                <p className="text-xs text-ink-500">
                  {o.organization} · {o.location}
                </p>
                <div className="mt-3">
                  <MatchBar score={o.matchScore} />
                </div>
              </Link>
            ))}
          </div>
        </section>
        <section className="card p-5">
          <h2 className="mb-4 font-serif text-lg text-forest-900">Tracker</h2>
          <ul className="space-y-3">
            {DEMO_APPLICATIONS.map(a => (
              <li key={a._id} className="flex items-center justify-between gap-3 rounded-xl p-2 hover:bg-cream-100">
                <div>
                  <p className="text-sm font-medium">{a.title}</p>
                  <p className="text-xs text-ink-500">{a.organization}</p>
                </div>
                <StatusBadge status={a.status} />
              </li>
            ))}
          </ul>
          <h2 className="mb-3 mt-8 font-serif text-lg text-forest-900">Skill gaps vs industry</h2>
          <ul className="space-y-3">
            {DEMO_SKILLS.filter(s => s.score < s.benchmark).map(s => (
              <li key={s.name}>
                <div className="mb-1 flex justify-between text-sm">
                  <span>{s.name}</span>
                  <span className="font-medium text-saffron-600">−{s.benchmark - s.score}</span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-stone-100">
                  <div className="h-full rounded-full bg-saffron-400" style={{ width: `${s.score}%` }} />
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}

function IndustryDash() {
  return (
    <div>
      <PageHeader
        kicker="Industry requirement portal"
        title="Hire pre-assessed AYUSH talent"
        subtitle="Post needs, rank applicants by AI match, move them through interview to offer."
        actions={
          <Link to="/industry/opportunities" className="btn-primary">
            Post a requirement
          </Link>
        }
      />
      <div className="grid gap-4 sm:grid-cols-4">
        <StatCard label="Active postings" value="6" />
        <StatCard label="Applicants" value="174" />
        <StatCard label="Avg. match" value="81%" />
        <StatCard label="Time-to-shortlist" value="48h" />
      </div>
      <div className="card mt-6 p-5">
        <h2 className="mb-4 font-semibold text-forest-900">Recruitment funnel</h2>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={[
            { stage: 'Applied', n: 174 },
            { stage: 'Review', n: 96 },
            { stage: 'Shortlist', n: 41 },
            { stage: 'Interview', n: 18 },
            { stage: 'Offer', n: 7 },
          ]}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e7e5e4" />
            <XAxis dataKey="stage" tick={{ fontSize: 12 }} />
            <YAxis />
            <Tooltip />
            <Bar dataKey="n" fill="#143d32" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function InstitutionDash() {
  return (
    <div>
      <PageHeader
        kicker="Institution analytics"
        title="Placement & curriculum alignment"
        subtitle="See which AYUSH skills industry is hiring for, and where your cohort has gaps."
      />
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Placement rate" value="71%" hint="This graduating cohort" />
        <StatCard label="Verified credentials" value="312" hint="Pending: 28" />
        <StatCard label="Industry postings mapped" value="64" />
      </div>
      <div className="card mt-6 p-5">
        <h2 className="mb-4 font-semibold text-forest-900">Demand vs graduate supply</h2>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={SKILL_DEMAND}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e7e5e4" />
            <XAxis dataKey="skill" tick={{ fontSize: 11 }} interval={0} angle={-18} textAnchor="end" height={70} />
            <YAxis />
            <Tooltip />
            <Bar dataKey="demand" fill="#c45c26" name="Industry demand" radius={[4, 4, 0, 0]} />
            <Bar dataKey="supply" fill="#143d32" name="Graduate supply" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function MinistryDash() {
  return (
    <div>
      <PageHeader
        kicker="Ministry of AYUSH"
        title="National skill-bridge snapshot"
        subtitle="Centralised, real-time placement data across streams and states."
      />
      <div className="grid gap-4 sm:grid-cols-4">
        <StatCard label="Institutes onboarded" value="186" />
        <StatCard label="Active internships" value="1,042" />
        <StatCard label="Students mapped" value="48.2k" />
        <StatCard label="Offers confirmed" value="6,410" />
      </div>
      <div className="card mt-6 p-5">
        <h2 className="mb-4 font-semibold text-forest-900">Internships vs jobs by state</h2>
        <ResponsiveContainer width="100%" height={300}>
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

function FacultyDash({ name }: { name: string }) {
  return (
    <div>
      <PageHeader
        kicker="Faculty development"
        title={`Welcome, ${name}`}
        subtitle="Industry exposure, FDP seats and research collaborations with AYUSH councils."
      />
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Open FDP seats" value="14" />
        <StatCard label="Faculty internships" value="9" />
        <StatCard label="Active collaborations" value="5" />
      </div>
    </div>
  );
}
