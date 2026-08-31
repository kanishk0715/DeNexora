import { useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Bell,
  BookOpen,
  Briefcase,
  ClipboardList,
  LayoutDashboard,
  LogOut,
  Users,
  BarChart3,
  FileCheck,
  GraduationCap,
  Building2,
  FolderKanban,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Logo, ROLE_LABEL } from '../Logo';
import type { User } from '../../types/api';

const NAV: Record<User['role'], { to: string; label: string; icon: typeof LayoutDashboard }[]> = {
  student: [
    { to: '/dashboard', label: 'Overview', icon: LayoutDashboard },
    { to: '/assessment', label: 'Assessment', icon: ClipboardList },
    { to: '/skills', label: 'Skill map', icon: BookOpen },
    { to: '/opportunities', label: 'Internships', icon: Briefcase },
    { to: '/applications', label: 'Tracker', icon: FolderKanban },
    { to: '/portfolio', label: 'Profile', icon: FileCheck },
  ],
  academician: [
    { to: '/dashboard', label: 'Overview', icon: LayoutDashboard },
    { to: '/faculty/internships', label: 'Internships', icon: Briefcase },
    { to: '/faculty/fdp', label: 'FDP', icon: GraduationCap },
    { to: '/faculty/research', label: 'Research', icon: BookOpen },
    { to: '/applications', label: 'Applications', icon: FolderKanban },
  ],
  industry: [
    { to: '/dashboard', label: 'Overview', icon: LayoutDashboard },
    { to: '/industry/opportunities', label: 'Postings', icon: Briefcase },
    { to: '/industry/applications', label: 'Applicants', icon: Users },
    { to: '/industry/programs', label: 'Training', icon: GraduationCap },
  ],
  institution: [
    { to: '/dashboard', label: 'Overview', icon: LayoutDashboard },
    { to: '/institution/students', label: 'Students', icon: Users },
    { to: '/institution/placements', label: 'Placements', icon: Briefcase },
    { to: '/institution/analytics', label: 'Analytics', icon: BarChart3 },
  ],
  admin: [
    { to: '/dashboard', label: 'National', icon: LayoutDashboard },
    { to: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
    { to: '/admin/verifications', label: 'Verify', icon: FileCheck },
    { to: '/admin/users', label: 'Directory', icon: Building2 },
  ],
};

const NOTICES = [
  { t: 'Interview scheduled', d: 'MDNIY Yoga Therapy — Fri 11:00' },
  { t: 'Shortlisted', d: 'AIIA Panchakarma intern' },
  { t: 'Skill verified', d: 'NIA attested Yoga therapy' },
];

export default function AppShell() {
  const { user, logout, isDemo } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [bell, setBell] = useState(false);
  if (!user) return null;
  const links = NAV[user.role];

  return (
    <div className="flex min-h-screen bg-cream-100">
      <aside className="hidden w-60 shrink-0 border-r border-slate-200 bg-white lg:flex lg:flex-col">
        <div className="border-b border-slate-100 px-5 py-4">
          <Logo />
        </div>
        <nav className="flex-1 space-y-0.5 p-3">
          {links.map(item => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/dashboard'}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium ${
                    isActive ? 'bg-forest-50 text-forest-800' : 'text-ink-500 hover:bg-slate-50 hover:text-ink-900'
                  }`
                }
              >
                <Icon size={18} />
                {item.label}
              </NavLink>
            );
          })}
        </nav>
        <p className="border-t border-slate-100 px-5 py-4 text-xs text-ink-500">AYUSH pathways</p>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        {isDemo && (
          <div className="bg-forest-50 px-4 py-1.5 text-center text-xs font-medium text-forest-800">
            Prototype — sample AYUSH data
          </div>
        )}
        <header className="sticky top-0 z-20 flex items-center justify-between border-b border-slate-200 bg-white/90 px-4 py-3 backdrop-blur lg:px-8">
          <div className="lg:hidden">
            <Logo compact />
          </div>
          <p className="hidden text-sm text-ink-500 lg:block">Skill mapping · internships · placement</p>
          <div className="relative flex items-center gap-2">
            <button className="relative rounded-lg p-2 text-ink-700 hover:bg-slate-50" aria-label="Notifications" onClick={() => setBell(v => !v)}>
              <Bell size={18} />
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-forest-600" />
            </button>
            {bell && (
              <div className="absolute right-12 top-11 z-30 w-72 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-card">
                <p className="border-b px-4 py-2 text-xs font-semibold text-ink-500">Updates</p>
                {NOTICES.map(n => (
                  <button
                    key={n.t}
                    type="button"
                    className="block w-full px-4 py-3 text-left text-sm hover:bg-cream-100"
                    onClick={() => {
                      setBell(false);
                      navigate('/applications');
                    }}
                  >
                    <span className="font-medium text-ink-900">{n.t}</span>
                    <span className="mt-0.5 block text-xs text-ink-500">{n.d}</span>
                  </button>
                ))}
              </div>
            )}
            <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-cream-100 py-1 pl-1 pr-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-forest-600 text-xs font-bold text-white">
                {user.name.slice(0, 1)}
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-semibold leading-none text-ink-900">{user.name.split(' ')[0]}</p>
                <p className="mt-0.5 text-[10px] text-ink-500">{ROLE_LABEL[user.role]}</p>
              </div>
            </div>
            <button
              onClick={() => {
                logout();
                navigate('/');
              }}
              className="rounded-lg p-2 text-ink-500 hover:bg-red-50 hover:text-red-700"
              title="Sign out"
            >
              <LogOut size={18} />
            </button>
          </div>
        </header>

        <div className="flex gap-1 overflow-x-auto border-b border-slate-200 bg-white px-2 py-2 lg:hidden">
          {links.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/dashboard'}
              className={({ isActive }) =>
                `whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-medium ${
                  isActive ? 'bg-forest-600 text-white' : 'bg-cream-100 text-ink-700'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </div>

        <main className="flex-1 px-4 py-8 lg:px-8">
          <AnimatePresence mode="wait">
            <motion.div key={location.pathname} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }}>
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
