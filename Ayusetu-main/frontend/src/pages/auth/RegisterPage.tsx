import { useState, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../../lib/api';
import { useAuth } from '../../contexts/AuthContext';
import { SiteNav } from '../../components/layout/SiteNav';
import { SiteFooter } from '../../components/layout/SiteFooter';

const ROLES = [
  { value: 'student', label: 'AYUSH student' },
  { value: 'academician', label: 'Faculty / academician' },
  { value: 'industry', label: 'Hospital / industry partner' },
  { value: 'institution', label: 'Institution admin' },
];

export default function RegisterPage() {
  const { enterDemo } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'student' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api.post('/auth/register', form);
      setSuccess('Registration successful. If email is not configured, use prototype preview to continue.');
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Server not running — you can still explore the prototype.';
      const fieldErrors = err.response?.data?.errors;
      setError(fieldErrors ? fieldErrors.map((x: any) => x.message).join(', ') : msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-cream-100">
      <SiteNav />
      <main className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="card p-8">
            <h1 className="text-2xl font-bold text-ink-900">Create your AyuSetu profile</h1>
            <p className="mt-1 text-sm text-ink-500">One identity for skills, internships and placements</p>

            {error && <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">{error}</div>}
            {success && <div className="mt-4 rounded-xl border border-forest-200 bg-forest-50 p-3 text-sm text-forest-800">{success}</div>}

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              {[
                { id: 'name', label: 'Full name', type: 'text' },
                { id: 'email', label: 'Email', type: 'email' },
                { id: 'password', label: 'Password (min. 8 characters)', type: 'password' },
              ].map(field => (
                <div key={field.id}>
                  <label htmlFor={field.id} className="mb-1 block text-sm font-medium text-ink-700">
                    {field.label}
                  </label>
                  <input
                    id={field.id}
                    type={field.type}
                    className="input"
                    required
                    value={(form as any)[field.id]}
                    onChange={e => setForm(f => ({ ...f, [field.id]: e.target.value }))}
                  />
                </div>
              ))}
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
                  {ROLES.map(r => (
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
              <Link to="/login" className="font-semibold text-forest-700 hover:underline">
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
            Skip to prototype as this role
          </button>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
