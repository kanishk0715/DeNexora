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
    { to: '/assessment', label: 'Skill assessment', icon: ClipboardList },
    { to: '/skills', label: 'Skill map', icon: BookOpen },
    { to: '/opportunities', label: 'Internships & jobs', icon: Briefcase },
    { to: '/applications', label: 'Tracker', icon: FolderKanban },
    { to: '/portfolio', label: 'Verified profile', icon: FileCheck },
  ],
  academician: [
    { to: '/dashboard', label: 'Overview', icon: LayoutDashboard },
    { to: '/faculty/internships', label: 'Faculty internships', icon: Briefcase },
    { to: '/faculty/fdp', label: 'FDP & workshops', icon: GraduationCap },
    { to: '/faculty/research', label: 'Research collab', icon: BookOpen },
    { to: '/applications', label: 'My applications', icon: FolderKanban },
  ],
  industry: [
    { to: '/dashboard', label: 'Overview', icon: LayoutDashboard },
    { to: '/industry/opportunities', label: 'Requirement portal', icon: Briefcase },
    { to: '/industry/applications', label: 'Talent shortlist', icon: Users },
    { to: '/industry/programs', label: 'Training seats', icon: GraduationCap },
  ],
  institution: [
    { to: '/dashboard', label: 'Overview', icon: LayoutDashboard },
    { to: '/institution/students', label: 'Student profiles', icon: Users },
    { to: '/institution/placements', label: 'Placements', icon: Briefcase },
    { to: '/institution/analytics', label: 'Skill-gap analytics', icon: BarChart3 },
  ],
  admin: [
    { to: '/dashboard', label: 'National overview', icon: LayoutDashboard },
    { to: '/admin/analytics', label: 'Ministry analytics', icon: BarChart3 },
    { to: '/admin/verifications', label: 'Credential layer', icon: FileCheck },
    { to: '/admin/users', label: 'Institutes & industry', icon: Building2 },
  ],
};

const NOTICES = [
  { t: 'Interview scheduled', d: 'MDNIY Yoga Therapy — Fri 11:00' },
  { t: 'Shortlisted', d: 'AIIA Panchakarma intern' },
  { t: 'Skill verified', d: 'NIA attested your Yoga therapy badge' },
];

export default function AppShell() {
  const { user, logout, isDemo } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [bell, setBell] = useState(false);
  if (!user) return null;
  const links = NAV[user.role];

  return (
    <div className="min-h-screen">
      <div className="flex min-h-screen">
        <aside className="hidden w-64 shrink-0 bg-gradient-to-b from-forest-800 via-forest-800 to-forest-900 text-cream-50 lg:flex lg:flex-col">
          <div className="border-b border-white/10 px-5 py-5">
            <Logo light />
          </div>
          <nav className="flex-1 space-y-1 p-3">
            {links.map(item => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === '/dashboard'}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                      isActive
                        ? 'bg-white/15 text-white shadow-inner ring-1 ring-white/20'
                        : 'text-cream-200/80 hover:bg-white/10 hover:text-white'
                    }`
                  }
                >
                  <Icon size={18} />
                  {item.label}
                </NavLink>
              );
            })}
          </nav>
          <div className="border-t border-white/10 p-4 text-xs text-cream-200/70">Ministry of AYUSH pathways</div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          {isDemo && (
            <div className="bg-gradient-to-r from-saffron-600 to-saffron-500 px-4 py-1.5 text-center text-xs font-medium text-white">
              Interactive prototype — sample AYUSH data
            </div>
          )}
          <header className="sticky top-0 z-20 flex items-center justify-between border-b border-white/50 bg-cream-50/80 px-4 py-3 backdrop-blur-md lg:px-8">
            <div className="lg:hidden">
              <Logo compact />
            </div>
            <p className="hidden text-sm text-ink-500 lg:block">Skill mapping · internships · placement</p>
            <div className="relative flex items-center gap-3">
              <button
                className="relative rounded-xl p-2 text-ink-700 transition hover:bg-white"
                aria-label="Notifications"
                onClick={() => setBell(v => !v)}
              >
                <Bell size={18} />
                <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-saffron-500 ring-2 ring-cream-50" />
              </button>
              {bell && (
                <div className="absolute right-16 top-12 z-30 w-72 overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-lift">
                  <p className="border-b px-4 py-2 text-xs font-semibold uppercase tracking-wide text-ink-500">Updates</p>
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
                      <span className="font-medium text-forest-900">{n.t}</span>
                      <span className="mt-0.5 block text-xs text-ink-500">{n.d}</span>
                    </button>
                  ))}
                </div>
              )}
              <div className="flex items-center gap-2 rounded-full border border-white bg-white/80 py-1 pl-1 pr-3 shadow-sm">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-forest-700 text-xs font-bold text-white">
                  {user.name.slice(0, 1)}
                </div>
                <div className="hidden text-right sm:block">
                  <p className="text-sm font-semibold leading-none text-ink-900">{user.name.split(' ')[0]}</p>
                  <p className="mt-0.5 text-[10px] uppercase tracking-wide text-forest-600">{ROLE_LABEL[user.role]}</p>
                </div>
              </div>
              <button
                onClick={() => {
                  logout();
                  navigate('/');
                }}
                className="rounded-xl p-2 text-ink-500 hover:bg-red-50 hover:text-red-700"
                title="Sign out"
              >
                <LogOut size={18} />
              </button>
            </div>
          </header>

          <div className="flex gap-1 overflow-x-auto border-b border-stone-200 bg-white/70 px-2 py-2 lg:hidden">
            {links.map(item => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/dashboard'}
                className={({ isActive }) =>
                  `whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-medium ${
                    isActive ? 'bg-forest-700 text-white' : 'bg-cream-100 text-ink-700'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </div>

          <main className="flex-1 px-4 py-6 lg:px-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.22 }}
              >
                <Outlet />
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>
    </div>
  );
}
