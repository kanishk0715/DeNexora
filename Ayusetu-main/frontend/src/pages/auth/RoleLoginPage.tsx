import { useState, FormEvent } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { AuthFrame } from '../../components/layout/AuthFrame';
import type { User } from '../../types/api';

const GATES = {
  student: {
    title: 'Student sign in',
    subtitle: 'Skill map, internships, assessment and resume analyzer',
    kicker: 'Student portal',
    panelTitle: 'Prove clinical hours. Get ranked internships.',
    panelBody: 'Verified AYUSH skills, DPDP consent, and a placement tracker in one workspace.',
    allowed: ['student'] as User['role'][],
    demo: 'student' as User['role'],
    demoLabel: 'Enter as student',
    register: '/register?role=student',
  },
  partners: {
    title: 'Partner sign in',
    subtitle: 'Faculty, hospitals and institutes',
    kicker: 'Partner portal',
    panelTitle: 'Hire, teach, or verify on one AYUSH map.',
    panelBody: 'Post internships, attest student credentials, or join faculty development.',
    allowed: ['academician', 'industry', 'institution'] as User['role'][],
    demo: 'industry' as User['role'],
    demoLabel: 'Enter as partner',
    register: '/register?role=partners',
  },
  ministry: {
    title: 'Ministry sign in',
    subtitle: 'National skill-bridge snapshot',
    kicker: 'Ministry of AYUSH',
    panelTitle: 'A national pulse of internships and placements.',
    panelBody: 'State-wise internships, verified credentials and institute onboarding.',
    allowed: ['admin'] as User['role'][],
    demo: 'admin' as User['role'],
    demoLabel: 'Enter as ministry',
    register: '/register?role=ministry',
  },
} as const;

const PARTNER_DEMOS: { role: User['role']; label: string }[] = [
  { role: 'academician', label: 'Faculty' },
  { role: 'industry', label: 'Hospital' },
  { role: 'institution', label: 'Institute' },
];

export default function RoleLoginPage() {
  const { gate } = useParams<{ gate: string }>();
  const cfg = GATES[gate as keyof typeof GATES];
  const { login, enterDemo } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!cfg) {
    return (
      <AuthFrame>
        <div className="card max-w-md p-8">
          <p className="font-semibold text-ink-900">Unknown login</p>
          <Link to="/login" className="mt-4 inline-block font-semibold text-forest-700">
            Choose a portal
          </Link>
        </div>
      </AuthFrame>
    );
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password, [...cfg.allowed]);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || err.response?.data?.message || 'Live login requires backend connection. Use demo access below.');
    } finally {
      setLoading(false);
    }
  };

  const openDemo = (role: User['role']) => {
    enterDemo(role);
    navigate('/dashboard');
  };

  return (
    <AuthFrame kicker={cfg.kicker} title={cfg.panelTitle} body={cfg.panelBody}>
      <div className="w-full max-w-md">
        <p className="mb-3 text-sm">
          <Link to="/login" className="font-semibold text-forest-700 hover:underline">
            ← All portals
          </Link>
        </p>
        <div className="card p-8">
          <h1 className="font-serif text-2xl font-semibold text-ink-900">{cfg.title}</h1>
          <p className="mt-1 text-sm text-ink-500">{cfg.subtitle}</p>
          {error && <div className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-800">{error}</div>}
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label htmlFor="email" className="mb-1 block text-sm font-medium text-ink-700">
                Email
              </label>
              <input id="email" className="input" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
            <div>
              <label htmlFor="password" className="mb-1 block text-sm font-medium text-ink-700">
                Password
              </label>
              <input
                id="password"
                className="input"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>
          <p className="mt-6 text-center text-sm text-ink-500">
            New?{' '}
            <Link to={cfg.register} className="font-semibold text-forest-700 hover:underline">
              Create an account
            </Link>
          </p>
        </div>
        {gate === 'partners' ? (
          <div className="mt-4 grid gap-2">
            {PARTNER_DEMOS.map(p => (
              <button key={p.role} type="button" className="btn-secondary w-full" onClick={() => openDemo(p.role)}>
                Enter as {p.label.toLowerCase()}
              </button>
            ))}
          </div>
        ) : (
          <button type="button" onClick={() => openDemo(cfg.demo)} className="btn-secondary mt-4 w-full">
            {cfg.demoLabel}
          </button>
        )}
      </div>
    </AuthFrame>
  );
}
