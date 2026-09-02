import { useEffect, useRef, useState } from 'react';
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
  Landmark,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { ROLE_LABEL } from '../Logo';
import { IndiaAppBar, MinistryLogo } from '../brand/IndiaMark';
import { TirangaMark } from './TirangaBar';
import { SearchTrigger } from '../CommandPalette';
import { PageSkeleton } from '../ui/Skeleton';
import { LanguageSelect } from './LanguageSelect';
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
    { to: '/exams-schemes', label: 'Exams & schemes', icon: Landmark },
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

const NOTICES: Record<User['role'], { t: string; d: string; to: string }[]> = {
  student: [
    { t: 'Interview scheduled', d: 'MDNIY Yoga Therapy — Fri 11:00', to: '/applications' },
    { t: 'Shortlisted', d: 'AIIA Panchakarma intern', to: '/applications' },
    { t: 'Skill verified', d: 'NIA attested Yoga therapy', to: '/skills' },
    { t: 'AIAPGET window', d: 'Check NTA bulletin for this cycle', to: '/exams-schemes' },
  ],
  academician: [
    { t: 'FDP seat open', d: 'Digital case documentation — 14 seats', to: '/faculty/fdp' },
    { t: 'Research call', d: 'CCRAS multi-centric Panchakarma', to: '/faculty/research' },
    { t: 'Industry rotation', d: 'Kerala Ayurveda operations shadow', to: '/faculty/internships' },
  ],
  industry: [
    { t: 'New applicants', d: '12 matched above 80% this week', to: '/industry/applications' },
    { t: 'Posting live', d: 'Panchakarma intern — 6 seats', to: '/industry/opportunities' },
    { t: 'Training cohort', d: 'Onboarding module ready for review', to: '/industry/programs' },
  ],
  institution: [
    { t: 'Credentials pending', d: '28 students awaiting attestation', to: '/institution/students' },
    { t: 'Offer accepted', d: 'Placement rate this cohort: 71%', to: '/institution/placements' },
    { t: 'Demand spike', d: 'Nadi Pariksha tagged in 18 postings', to: '/institution/analytics' },
  ],
  admin: [
    { t: 'Verifications queue', d: 'Institute onboarding awaiting review', to: '/admin/verifications' },
    { t: 'National pulse', d: '1,042 internships active this week', to: '/admin/analytics' },
    { t: 'Directory update', d: '3 new AYUSH partners listed', to: '/admin/users' },
  ],
};

export default function AppShell() {
  const { user, logout, isDemo } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [bell, setBell] = useState(false);
  const [ready, setReady] = useState(false);
  const [drawer, setDrawer] = useState(false);
  const bellRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setReady(false);
    setDrawer(false);
    setBell(false);
    const t = window.setTimeout(() => setReady(true), 280);
    return () => window.clearTimeout(t);
  }, [location.pathname]);

  useEffect(() => {
    if (!bell) return;
    const onDoc = (e: MouseEvent) => {
      if (!bellRef.current?.contains(e.target as Node)) setBell(false);
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [bell]);

  if (!user) return null;
  const links = NAV[user.role];
  const notices = NOTICES[user.role];

  const navList = (
    <nav className="min-h-0 flex-1 space-y-0.5 overflow-y-auto p-3" aria-label="Workspace">
      {links.map(item => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/' || item.to === '/dashboard'}
            className={({ isActive }) =>
              `group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-forest-50 text-forest-800 font-semibold shadow-sm ring-1 ring-forest-200'
                  : 'text-ink-600 hover:bg-slate-50 hover:text-forest-800'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <span className={`absolute inset-y-2 left-0 w-1 rounded-full ${isActive ? 'bg-forest-600' : 'bg-transparent'}`} />
                <Icon size={18} className={isActive ? 'text-forest-700' : 'text-ink-400 group-hover:text-forest-700'} />
                {item.label}
              </>
            )}
          </NavLink>
        );
      })}
    </nav>
  );

  const drawerInner = (
    <>
      <div className="shrink-0 border-b border-forest-100 bg-cream-50 px-4 py-4">
        <div className="flex items-center gap-2">
          <TirangaMark className="h-8 w-11" />
          <MinistryLogo className="h-14 w-auto" />
        </div>
        <p className="mt-3 inline-flex rounded-full bg-forest-50 px-2.5 py-1 text-[11px] font-semibold text-forest-800 ring-1 ring-forest-100">
          {ROLE_LABEL[user.role]}
          {isDemo ? ' · demo' : ''}
        </p>
      </div>
      {navList}
      <p className="shrink-0 border-t border-slate-100 px-5 py-4 text-xs font-medium text-forest-700">Ministry of AYUSH · skill bridge</p>
    </>
  );

  return (
    <div className="flex h-dvh max-h-dvh overflow-hidden overscroll-none bg-transparent">
      <aside className="hidden h-full w-60 shrink-0 overflow-hidden border-r border-forest-100 bg-cream-50/95 shadow-sm backdrop-blur-md md:flex md:flex-col">
        {drawerInner}
      </aside>

      <AnimatePresence>
        {drawer && (
          <motion.div className="fixed inset-0 z-50 md:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <button type="button" className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]" aria-label="Close menu" onClick={() => setDrawer(false)} />
            <motion.aside
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -12, opacity: 0 }}
              className="relative flex h-full w-64 flex-col overflow-hidden bg-cream-50 shadow-2xl"
            >
              <button
                type="button"
                className="absolute right-2 top-2 rounded-lg p-2 text-ink-500 hover:bg-forest-50"
                aria-label="Close menu"
                onClick={() => setDrawer(false)}
              >
                <X size={18} />
              </button>
              {drawerInner}
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
        <IndiaAppBar innerClassName="px-4 lg:px-8" variant="light">
          <button
            type="button"
            className="rounded-lg p-2 text-ink-700 transition hover:bg-forest-50 md:hidden"
            aria-label="Open menu"
            onClick={() => setDrawer(true)}
          >
            <Menu size={18} />
          </button>
          <TirangaMark className="hidden h-7 w-10 sm:inline-flex" />
          <SearchTrigger />
          <p className="hidden text-sm text-ink-500 lg:block xl:hidden">Skill mapping · internships</p>
          <div className="relative ml-auto flex items-center gap-2" ref={bellRef}>
            <LanguageSelect />
            <button
              type="button"
              className="rounded-lg p-2 text-ink-700 transition hover:bg-forest-50 md:hidden"
              aria-label="Search internships"
              onClick={() => window.dispatchEvent(new Event('ayusetu-palette'))}
            >
              <Search size={18} />
            </button>
            <button
              className="relative rounded-lg p-2 text-ink-700 transition hover:bg-forest-50"
              aria-label="Notifications"
              aria-expanded={bell}
              onClick={() => setBell(v => !v)}
            >
              <Bell size={18} />
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-saffron-500 ring-2 ring-white" />
            </button>
            <AnimatePresence>
              {bell && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 4 }}
                  className="absolute right-12 top-11 z-30 w-80 overflow-hidden rounded-2xl border border-forest-100 bg-cream-50 shadow-xl"
                >
                  <p className="border-b border-slate-100 px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-ink-500">Updates</p>
                  {notices.map(n => (
                    <button
                      key={n.t}
                      type="button"
                      className="block w-full px-4 py-3 text-left text-sm transition hover:bg-forest-50"
                      onClick={() => {
                        setBell(false);
                        navigate(n.to);
                      }}
                    >
                      <span className="font-medium text-ink-900">{n.t}</span>
                      <span className="mt-0.5 block text-xs text-ink-500">{n.d}</span>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
            <div className="flex items-center gap-2 rounded-full border border-forest-200 bg-cream-50 py-1 pl-1 pr-3 shadow-sm">
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
              className="rounded-lg p-2 text-ink-500 transition hover:bg-red-50 hover:text-red-700"
              title="Sign out"
            >
              <LogOut size={18} />
            </button>
          </div>
        </IndiaAppBar>

        <main className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden px-4 py-8 pb-24 lg:px-10 lg:pb-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              className="mx-auto w-full max-w-6xl"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.22 }}
            >
              {ready ? <Outlet /> : <PageSkeleton />}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      <nav
        className="no-print fixed inset-x-0 bottom-0 z-30 border-t border-forest-100 bg-cream-50/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md md:hidden"
        aria-label="Workspace"
      >
        <div className="flex">
          {links.slice(0, 5).map(item => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/' || item.to === '/dashboard'}
                className={({ isActive }) =>
                  `flex min-w-0 flex-1 flex-col items-center gap-0.5 px-1 py-2 text-[10px] font-medium transition ${
                    isActive ? 'text-forest-700' : 'text-ink-400'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <span className={`rounded-lg p-1 ${isActive ? 'bg-forest-50' : ''}`}>
                      <Icon size={18} />
                    </span>
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
