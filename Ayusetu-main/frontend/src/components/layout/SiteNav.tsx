import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { IndiaAppBar, MinistryLogo } from '../brand/IndiaMark';
import { useAuth } from '../../contexts/AuthContext';
import { useLocale } from '../../contexts/LocaleContext';
import { COPY } from '../../i18n/public';
import { LanguageSelect } from './LanguageSelect';

export function SiteNav({ onGetStarted }: { onGetStarted?: () => void }) {
  const { user, logout } = useAuth();
  const { lang } = useLocale();
  const location = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('');
  const c = COPY[lang].nav;

  // Scroll spy - detect which section is visible
  useEffect(() => {
    if (location.pathname !== '/') return;

    const handleScroll = () => {
      const sections = ['partners', 'for-you', 'how-it-works', 'features', 'pathways', 'workspaces'];
      const scrollPosition = window.scrollY + 150; // offset for navbar

      // Check if at top (home)
      if (window.scrollY < 200) {
        setActiveSection('');
        return;
      }

      // Find which section is currently visible
      for (const sectionId of sections) {
        const element = document.getElementById(sectionId);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(sectionId);
            return;
          }
        }
      }
    };

    handleScroll(); // Check on mount
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [location.pathname]);

  // Also update activeSection when hash changes
  useEffect(() => {
    const hash = location.hash.replace(/^#/, '');
    if (hash) {
      setActiveSection(hash);
    }
  }, [location.hash]);

  const start = () => {
    setOpen(false);
    if (onGetStarted) onGetStarted();
    else navigate('/?start=1');
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const links: { to?: string; hash?: string; label: string }[] = [
    { to: '/', label: c.home || 'Home' },
    { hash: 'for-you', label: c.forYou },
    { hash: 'how-it-works', label: c.how },
    { hash: 'features', label: c.features },
    { to: '/about', label: c.about },
  ];

  const isActive = (l: (typeof links)[number]) => {
    // For external routes (not on home page)
    if (l.to && l.to !== '/') return location.pathname === l.to;
    
    // For home page root
    if (l.to === '/') return location.pathname === '/' && !activeSection;
    
    // For section hashes - use activeSection from scroll spy
    return location.pathname === '/' && activeSection === l.hash;
  };

  const NavItems = ({ onClick }: { onClick?: () => void }) => (
    <>
      {links.map(l => {
        const active = isActive(l);
        const className = `rounded-lg px-4 py-2 text-base font-semibold text-white transition hover:bg-white/15 ${
          active ? 'bg-white/20 shadow-sm' : ''
        }`;
        return l.to ? (
          <Link
            key={l.to}
            to={l.to === '/' ? { pathname: '/', hash: '' } : l.to}
            onClick={onClick}
            className={className}
            aria-current={active ? 'page' : undefined}
          >
            {l.label}
          </Link>
        ) : (
          <Link
            key={l.hash}
            to={{ pathname: '/', hash: l.hash }}
            onClick={onClick}
            className={className}
            aria-current={active ? 'page' : undefined}
          >
            {l.label}
          </Link>
        );
      })}
    </>
  );

  return (
    <IndiaAppBar
      innerClassName="w-full px-4"
      after={
        open ? (
          <div className="border-b border-[#084830] bg-[#0b5c3a] px-4 py-3 lg:hidden">
            <nav className="flex flex-col gap-1" aria-label="Mobile">
              <NavItems onClick={() => setOpen(false)} />
            </nav>
          </div>
        ) : null
      }
    >
      <Link to="/" className="ml-[0.5in] flex shrink-0 items-center" aria-label="Ministry of Ayush home">
        <MinistryLogo className="h-10 w-auto sm:h-11" />
      </Link>

      <nav className="hidden flex-1 items-center justify-end gap-1 pr-[1in] lg:flex" aria-label="Primary">
        <NavItems />
      </nav>

      <div className="ml-auto flex shrink-0 items-center gap-2">
        <LanguageSelect />
        {user ? (
          <>
            <button
              type="button"
              className="hidden rounded-lg border border-white/60 bg-transparent px-4 py-2 text-base font-semibold text-white transition hover:bg-white/15 sm:block"
              onClick={handleLogout}
            >
              Logout
            </button>
            <Link to="/dashboard" className="rounded-lg bg-white px-4 py-2 text-base font-semibold text-[#0b5c3a] transition hover:bg-[#e8f3ee]">
              {c.openWorkspace}
            </Link>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className="hidden rounded-lg border border-white/60 bg-transparent px-4 py-2 text-base font-semibold text-white transition hover:bg-white/15 sm:block"
            >
              {c.login}
            </Link>
            <button
              type="button"
              className="rounded-lg bg-white px-4 py-2 text-base font-semibold text-[#0b5c3a] transition hover:bg-[#e8f3ee]"
              onClick={start}
            >
              {c.getStarted}
            </button>
          </>
        )}
        <button
          type="button"
          className="rounded-lg p-2 text-white hover:bg-white/15 lg:hidden"
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen(v => !v)}
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>
    </IndiaAppBar>
  );
}
