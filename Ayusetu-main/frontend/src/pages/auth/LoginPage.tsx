import { Link } from 'react-router-dom';
import { ArrowRight, Building2, GraduationCap, ShieldCheck } from 'lucide-react';
import { AuthFrame } from '../../components/layout/AuthFrame';

const PORTALS = [
  {
    to: '/login/student',
    icon: GraduationCap,
    title: 'Student',
    hint: 'Skill map, assessment, internships and resume analyzer',
  },
  {
    to: '/login/partners',
    icon: Building2,
    title: 'Faculty, hospital & institute',
    hint: 'Hire talent, verify students, or join as faculty',
  },
  {
    to: '/login/ministry',
    icon: ShieldCheck,
    title: 'Ministry of AYUSH',
    hint: 'National skill and placement insights',
  },
];

export default function LoginPage() {
  return (
    <AuthFrame
      kicker="Choose your portal"
      title="Separate sign-in for each AyuSetu role."
      body="Students, partner organisations and the ministry each have their own login so workspaces stay distinct."
    >
      <div className="w-full max-w-md">
        <div className="card p-8">
          <h1 className="font-serif text-2xl font-semibold text-ink-900">Sign in</h1>
          <p className="mt-1 text-sm text-ink-500">Pick the portal that matches your role</p>
          <div className="mt-6 grid gap-3">
            {PORTALS.map(p => {
              const Icon = p.icon;
              return (
                <Link
                  key={p.to}
                  to={p.to}
                  className="group flex items-start gap-3 rounded-xl border border-slate-200 p-4 text-left shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-forest-400 hover:bg-forest-50 hover:shadow-md"
                >
                  <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-forest-50 text-forest-700 group-hover:bg-white">
                    <Icon size={18} />
                  </span>
                  <span>
                    <p className="font-semibold text-ink-900">{p.title}</p>
                    <p className="mt-1 text-sm text-ink-500">{p.hint}</p>
                  </span>
                  <ArrowRight size={16} className="ml-auto mt-2 shrink-0 text-forest-600 opacity-0 transition group-hover:opacity-100" />
                </Link>
              );
            })}
          </div>
          <p className="mt-6 text-center text-sm text-ink-500">
            New?{' '}
            <Link to="/register" className="font-semibold text-forest-700 hover:underline">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </AuthFrame>
  );
}
