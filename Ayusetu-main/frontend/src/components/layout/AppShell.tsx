import { useEffect, useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Bell,
  BookOpen,
  Briefcase,
  ClipboardList,
  LayoutDashboard,
  LogOut,
  Search,
  Users,
  BarChart3,
  FileCheck,
  GraduationCap,
  Building2,
  FileScan,
  FolderKanban,
  Home,
  Menu,
  X,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { ROLE_LABEL } from '../Logo';
import { IndiaAppBar, MinistryLogo } from '../brand/IndiaMark';
import { SearchTrigger } from '../CommandPalette';
import { PageSkeleton } from '../ui/Skeleton';
import type { User } from '../../types/api';

const HOME = { to: '/', label: 'Home', icon: Home };

const NAV: Record<User['role'], { to: string; label: string; icon: typeof LayoutDashboard }[]> = {
  student: [
    HOME,
    { to: '/dashboard', label: 'Overview', icon: LayoutDashboard },
    { to: '/assessment', label: 'Assessment', icon: ClipboardList },
    { to: '/resume', label: 'Resume analyzer', icon: FileScan },
    { to: '/skills', label: 'Skill map', icon: BookOpen },
    { to: '/opportunities', label: 'Internships', icon: Briefcase },
    { to: '/applications', label: 'Tracker', icon: FolderKanban },
    { to: '/portfolio', label: 'Profile', icon: FileCheck },
  ],
  academician: [
    HOME,
    { to: '/dashboard', label: 'Overview', icon: LayoutDashboard },
    { to: '/faculty/internships', label: 'Internships', icon: Briefcase },
    { to: '/faculty/fdp', label: 'FDP', icon: GraduationCap },
    { to: '/faculty/research', label: 'Research', icon: BookOpen },
    { to: '/applications', label: 'Applications', icon: FolderKanban },
  ],
  industry: [
    HOME,
    { to: '/dashboard', label: 'Overview', icon: LayoutDashboard },
    { to: '/industry/opportunities', label: 'Postings', icon: Briefcase },
    { to: '/industry/applications', label: 'Applicants', icon: Users },
    { to: '/industry/programs', label: 'Training', icon: GraduationCap },
  ],
  institution: [
    HOME,
    { to: '/dashboard', label: 'Overview', icon: LayoutDashboard },
    { to: '/institution/students', label: 'Students', icon: Users },
    { to: '/institution/placements', label: 'Placements', icon: Briefcase },
    { to: '/institution/analytics', label: 'Analytics', icon: BarChart3 },
  ],
  admin: [
    HOME,
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
  const [ready, setReady] = useState(false);
  const [drawer, setDrawer] = useState(false);

  useEffect(() => {
    setReady(false);
    setDrawer(false);
    const t = window.setTimeout(() => setReady(true), 380);
    return () => window.clearTimeout(t);
  }, [location.pathname]);

  if (!user) return null;
  const links = NAV[user.role];

  const drawerInner = (
    <>
      <div className="shrink-0 border-b border-forest-100 bg-gradient-to-b from-forest-50 to-white px-4 py-3">
        <MinistryLogo className="h-16 w-auto" />
      </div>
      <nav className="min-h-0 flex-1 space-y-0.5 overflow-hidden p-3">
        {links.map(item => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/' || item.to === '/dashboard'}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                  isActive
                    ? 'bg-forest-100 text-forest-800 font-semibold shadow-sm ring-1 ring-forest-200'
                    : 'text-ink-600 hover:bg-forest-50 hover:text-forest-800'
                }`
              }
            >
              <Icon size={18} />
              {item.label}
            </NavLink>
          );
        })}
      </nav>
      <p className="shrink-0 border-t border-forest-100 px-5 py-4 text-xs font-medium text-forest-700">AYUSH pathways</p>
    </>
  );

  return (
    <div className="flex h-dvh max-h-dvh overflow-hidden overscroll-none bg-slate-50">
      <aside className="hidden h-full w-60 shrink-0 overflow-hidden border-r border-forest-100 bg-white md:flex md:flex-col">
        {drawerInner}
      </aside>

      {drawer && (
        <div className="fixed inset-0 z-50 md:hidden">
          <button type="button" className="absolute inset-0 bg-slate-900/40" aria-label="Close menu" onClick={() => setDrawer(false)} />
          <aside className="relative flex h-full w-60 flex-col overflow-hidden bg-white shadow-xl">
            <button
              type="button"
              className="absolute right-2 top-2 rounded-lg p-2 text-ink-500 hover:bg-forest-100"
              aria-label="Close menu"
              onClick={() => setDrawer(false)}
            >
              <X size={18} />
            </button>
            {drawerInner}
          </aside>
        </div>
      )}

      <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
        <IndiaAppBar innerClassName="px-4 lg:px-8" variant="light">
          <button
            type="button"
            className="rounded-lg p-2 text-ink-700 hover:bg-forest-100 md:hidden"
            aria-label="Open menu"
            onClick={() => setDrawer(true)}
          >
            <Menu size={18} />
          </button>
          <SearchTrigger />
          <p className="hidden text-sm text-ink-500 lg:block xl:hidden">Skill mapping · internships</p>
          <div className="relative ml-auto flex items-center gap-2">
            <button
              type="button"
              className="rounded-lg p-2 text-ink-700 hover:bg-forest-100 md:hidden"
              aria-label="Search internships"
              onClick={() => window.dispatchEvent(new Event('ayusetu-palette'))}
            >
              <Search size={18} />
            </button>
            <button className="relative rounded-lg p-2 text-ink-700 hover:bg-forest-100" aria-label="Notifications" onClick={() => setBell(v => !v)}>
              <Bell size={18} />
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-saffron-500" />
            </button>
            {bell && (
              <div className="absolute right-12 top-11 z-30 w-72 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-card">
                <p className="border-b px-4 py-2 text-xs font-semibold text-ink-500">Updates</p>
                {NOTICES.map(n => (
                  <button
                    key={n.t}
                    type="button"
                    className="block w-full px-4 py-3 text-left text-sm hover:bg-forest-50"
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
            <div className="flex items-center gap-2 rounded-full border border-forest-300 bg-white py-1 pl-1 pr-3 shadow-sm">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-forest-600 text-xs font-bold text-white">
                {user.name.slice(0, 1)}
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-semibold leading-none text-forest-900">{user.name.split(' ')[0]}</p>
                <p className="mt-0.5 text-[10px] text-forest-700">{ROLE_LABEL[user.role]}</p>
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
        </IndiaAppBar>

        <main className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden px-4 py-8 pb-24 lg:px-10 lg:pb-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              className="mx-auto w-full max-w-5xl"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.2 }}
            >
              {ready ? <Outlet /> : <PageSkeleton />}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      <nav
        className="no-print fixed inset-x-0 bottom-0 z-30 border-t border-forest-100 bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden"
        aria-label="Workspace"
      >
        <div className="flex">
          {links.map(item => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/' || item.to === '/dashboard'}
                className={({ isActive }) =>
                  `flex min-w-0 flex-1 flex-col items-center gap-0.5 px-1 py-2 text-[10px] font-medium ${
                    isActive ? 'text-forest-700' : 'text-ink-400'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon size={18} className={isActive ? 'text-forest-700' : ''} />
                    <span className="w-full truncate text-center">{item.label}</span>
                  </>
                )}
              </NavLink>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
