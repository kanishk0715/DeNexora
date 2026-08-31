import { useState, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Logo } from '../../components/Logo';

export default function LoginPage() {
  const { login, enterDemo } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Live login needs the backend. Use prototype preview below.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden overflow-hidden bg-forest-800 lg:block">
        <div className="absolute inset-0 mesh-hero opacity-40" />
        <div className="relative flex h-full flex-col justify-between p-12 text-cream-50">
          <Logo light />
          <div>
            <p className="font-serif text-4xl leading-tight">Match clinical skill to the right AYUSH seat.</p>
            <p className="mt-4 max-w-md text-cream-200/80">Verified profiles. Live match scores. One tracker from apply to offer.</p>
          </div>
          <p className="text-sm text-cream-200/60">AyuSetu · Ministry of AYUSH pathways</p>
        </div>
      </div>
      <div className="flex flex-col justify-center px-4 py-12 sm:px-10">
        <Link to="/" className="mb-8 lg:hidden">
          <Logo />
        </Link>
        <div className="mx-auto w-full max-w-md">
          <h1 className="font-serif text-3xl font-semibold text-forest-900">Welcome back</h1>
          <p className="mt-1 text-sm text-ink-500">Sign in to your AyuSetu workspace</p>
          {error && <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-800">{error}</div>}
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label htmlFor="email" className="mb-1 block text-sm font-medium text-ink-700">Email</label>
              <input id="email" className="input" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
            <div>
              <label htmlFor="password" className="mb-1 block text-sm font-medium text-ink-700">Password</label>
              <input id="password" className="input" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>
          <p className="mt-6 text-center text-sm text-ink-500">
            New to AyuSetu?{' '}
            <Link to="/register" className="font-semibold text-forest-700 hover:underline">Create an account</Link>
          </p>
          <button
            type="button"
            onClick={() => {
              enterDemo('student');
              navigate('/dashboard');
            }}
            className="mt-4 w-full rounded-xl border border-dashed border-forest-300 py-2.5 text-sm font-semibold text-forest-700 hover:bg-forest-50"
          >
            Open interactive student prototype
          </button>
        </div>
      </div>
    </div>
  );
}
