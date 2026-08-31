import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';

const ROLE_CONFIG = {
  student: {
    title: 'Student Dashboard',
    links: [
      { to: '/assessment', label: 'Take Assessment' },
      { to: '/skills', label: 'My Skills & Gaps' },
      { to: '/opportunities', label: 'Browse Opportunities' },
      { to: '/applications', label: 'My Applications' },
      { to: '/portfolio', label: 'My Portfolio' },
    ],
  },
  academician: {
    title: 'Academician Dashboard',
    links: [
      { to: '/faculty/internships', label: 'Faculty Internships' },
      { to: '/faculty/fdp', label: 'FDP & Workshops' },
      { to: '/faculty/research', label: 'Research Collaborations' },
      { to: '/applications', label: 'My Applications' },
    ],
  },
  industry: {
    title: 'Industry Dashboard',
    links: [
      { to: '/industry/opportunities', label: 'Manage Opportunities' },
      { to: '/industry/applications', label: 'Applicants' },
      { to: '/industry/programs', label: 'Learning Programs' },
    ],
  },
  institution: {
    title: 'Institution Dashboard',
    links: [
      { to: '/institution/students', label: 'Students' },
      { to: '/institution/analytics', label: 'Analytics' },
      { to: '/institution/placements', label: 'Placements' },
    ],
  },
  admin: {
    title: 'Admin Dashboard',
    links: [
      { to: '/admin/users', label: 'Manage Users' },
      { to: '/admin/verifications', label: 'Verifications' },
      { to: '/admin/analytics', label: 'Analytics' },
    ],
  },
};

export default function DashboardPage() {
  const { user, logout } = useAuth();
  if (!user) return null;

  const config = ROLE_CONFIG[user.role];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
        <span className="font-bold text-indigo-700 text-lg">Academia-Industry Portal</span>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">{user.name}</span>
          <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full capitalize">{user.role}</span>
          <button onClick={logout} className="text-sm text-gray-500 hover:text-red-600 transition">
            Sign out
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">{config.title}</h1>
        <p className="text-gray-500 text-sm mb-8">Welcome, {user.name}</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {config.links.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className="bg-white rounded-xl border border-gray-200 px-5 py-4 hover:border-indigo-400 hover:shadow-sm transition text-sm font-medium text-gray-800"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
