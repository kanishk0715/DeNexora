import { useState, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { AuthFrame } from '../../components/layout/AuthFrame';

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
      setError(err.response?.data?.message || 'Live login needs the backend. Use the prototype below.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthFrame>
      <div className="w-full max-w-md">
        <div className="card p-8">
          <h1 className="font-serif text-2xl font-semibold text-ink-900">Sign in</h1>
          <p className="mt-1 text-sm text-ink-500">Access your AyuSetu workspace</p>
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
            <Link to="/register" className="font-semibold text-forest-700 hover:underline">
              Create an account
            </Link>
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            enterDemo('student');
            navigate('/dashboard');
          }}
          className="btn-secondary mt-4 w-full"
        >
          Open student prototype
        </button>
      </div>
    </AuthFrame>
  );
}
