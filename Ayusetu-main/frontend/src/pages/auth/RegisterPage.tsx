import { useEffect, useState, FormEvent } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { api } from '../../lib/api';
import { useAuth } from '../../contexts/AuthContext';
import { AuthFrame } from '../../components/layout/AuthFrame';
import { PasswordField } from '../../components/ui/PasswordField';

const ALL_ROLES = [
  { value: 'student', label: 'AYUSH student' },
  { value: 'academician', label: 'Faculty / academician' },
  { value: 'industry', label: 'Hospital / industry partner' },
  { value: 'institution', label: 'Institution admin' },
  { value: 'admin', label: 'Ministry of AYUSH' },
];

function rolesForGate(gate: string | null) {
  if (gate === 'student') return ALL_ROLES.filter(r => r.value === 'student');
  if (gate === 'partners') return ALL_ROLES.filter(r => ['academician', 'industry', 'institution'].includes(r.value));
  if (gate === 'ministry') return ALL_ROLES.filter(r => r.value === 'admin');
  return ALL_ROLES.filter(r => r.value !== 'admin');
}

function loginForGate(gate: string | null) {
  if (gate === 'student') return '/login/student';
  if (gate === 'partners') return '/login/partners';
  if (gate === 'ministry') return '/login/ministry';
  return '/login';
}

export default function RegisterPage() {
  const { enterDemo } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const gate = params.get('role');
  const roles = rolesForGate(gate);
  const [form, setForm] = useState({ name: '', email: '', password: '', role: roles[0]?.value || 'student' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setForm(f => ({ ...f, role: roles[0]?.value || 'student' }));
  }, [gate]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api.post('/auth/register', form);
      setSuccess('Registration successful. Check your email to verify your account.');
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Server connection error. Please try again later.';
      const fieldErrors = err.response?.data?.errors;
      setError(fieldErrors ? fieldErrors.map((x: any) => x.message).join(', ') : msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthFrame>
        <div className="w-full max-w-md">
          <div className="card p-8">
            <h1 className="font-serif text-2xl font-semibold text-ink-900">Create your AyuSetu profile</h1>
            <p className="mt-1 text-sm text-ink-500">One identity for skills, internships and placements</p>

            {error && <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">{error}</div>}
            {success && <div className="mt-4 rounded-xl border border-forest-200 bg-forest-50 p-3 text-sm text-forest-800">{success}</div>}

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label htmlFor="name" className="mb-1 block text-sm font-medium text-ink-700">
                  Full name
                </label>
                <input
                  id="name"
                  type="text"
                  className="input"
                  required
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                />
              </div>
              <div>
                <label htmlFor="email" className="mb-1 block text-sm font-medium text-ink-700">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  className="input"
                  required
                  value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                />
              </div>
              <PasswordField
                label="Password (min. 8 characters)"
                value={form.password}
                onChange={password => setForm(f => ({ ...f, password }))}
                autoComplete="new-password"
              />
              <div>
                <label htmlFor="role" className="mb-1 block text-sm font-medium text-ink-700">
                  I am joining as
                </label>
                <select
                  id="role"
                  className="input"
                  value={form.role}
                  onChange={e => setForm(f => ({ ...f, role: e.target.value }))}
                >
                  {roles.map(r => (
                    <option key={r.value} value={r.value}>
                      {r.label}
                    </option>
                  ))}
                </select>
              </div>
              <label className="flex items-start gap-2 text-xs text-ink-500">
                <input type="checkbox" required className="mt-0.5" />
                I consent to share my skill profile with AYUSH hospitals and institutes I apply to (DPDP).
              </label>
              <button type="submit" disabled={loading} className="btn-primary w-full">
                {loading ? 'Creating…' : 'Create account'}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-ink-500">
              Already registered?{' '}
              <Link to={loginForGate(gate)} className="font-semibold text-forest-700 hover:underline">
                Sign in
              </Link>
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              enterDemo((form.role as any) || 'student');
              navigate('/dashboard');
            }}
            className="mt-4 w-full text-center text-sm font-semibold text-forest-700 hover:underline"
          >
            Continue as demo user
          </button>
        </div>
    </AuthFrame>
  );
}
