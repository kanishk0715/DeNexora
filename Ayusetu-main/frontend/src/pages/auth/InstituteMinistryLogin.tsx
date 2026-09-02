import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { School, Shield, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { SiteNav } from '../../components/layout/SiteNav';

export default function InstituteMinistryLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-transparent">
      <SiteNav />
      <div className="flex min-h-[calc(100vh-80px)] items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="card p-8">
            <div className="mb-6 text-center">
              <div className="mx-auto mb-4 flex gap-2 justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-forest-700">
                  <School className="h-8 w-8 text-white" />
                </div>
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-saffron-600">
                  <Shield className="h-8 w-8 text-white" />
                </div>
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Institute & Ministry Portal</h1>
              <p className="mt-2 text-sm text-gray-600">
                Verify students, analytics & national insights
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-600">
                  {error}
                </div>
              )}

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Official Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input py-3 pl-10 pr-4"
                    placeholder="admin@ayush.gov.in"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input py-3 pl-10 pr-12"
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-forest-800 hover:bg-forest-50"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    aria-pressed={showPassword}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full"
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>

            <div className="mt-6 text-center text-sm text-gray-600">
              Need access?{' '}
              <Link to="/contact" className="font-semibold text-forest-700 hover:underline">
                Contact Administrator
              </Link>
            </div>

            <div className="mt-4 text-center">
              <Link to="/login" className="text-sm text-gray-500 hover:underline">
                ← Back to login selection
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
