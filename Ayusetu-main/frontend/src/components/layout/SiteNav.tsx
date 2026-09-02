import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { IndiaAppBar, BrandLockup } from '../brand/IndiaMark';
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
    { to: '/communities', label: 'Communities' },
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

  const NavItems = ({ onClick, stacked }: { onClick?: () => void; stacked?: boolean }) => (
    <>
      {links.map(l => {
        const active = isActive(l);
        const className = stacked
          ? `block w-full rounded-md px-3 py-2.5 text-left text-sm font-medium text-white transition ${
              active ? 'bg-white/10 font-semibold' : 'hover:bg-white/5'
            }`
          : `nav-item relative whitespace-nowrap px-2.5 py-2 text-[13px] font-medium tracking-wide text-white transition-colors sm:px-3 sm:text-sm ${
              active ? 'is-active font-semibold' : 'hover:text-white/80'
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
      variant="wallpaper"
      showTiranga={false}
      innerClassName="mx-auto w-full max-w-[1400px] px-4 sm:px-6"
      after={
        open ? (
          <div className="nav-wallpaper border-y border-white/15 px-4 py-3 md:hidden">
            <nav className="mx-auto flex max-w-[1400px] flex-col gap-0.5" aria-label="Mobile">
              <NavItems stacked onClick={() => setOpen(false)} />
            </nav>
          </div>
        ) : null
      }
    >
      <Link to="/" className="shrink-0" aria-label="Ministry of Ayush home">
        <BrandLockup />
      </Link>

      <nav className="hidden min-w-0 flex-1 items-center justify-center gap-0.5 md:flex" aria-label="Primary">
        <NavItems />
      </nav>

      <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
        <LanguageSelect tone="dark" />
        {user ? (
          <>
            <button
              type="button"
              className="hidden px-2.5 py-2 text-[13px] font-medium text-white transition hover:text-white/80 sm:block"
              onClick={handleLogout}
            >
              Logout
            </button>
            <Link to="/dashboard" className="rounded-md border border-white px-3.5 py-2 text-[13px] font-semibold text-white transition hover:bg-white/10">
              {c.openWorkspace}
            </Link>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className="hidden px-2.5 py-2 text-[13px] font-medium text-white transition hover:text-white/80 sm:block"
            >
              {c.login}
            </Link>
            <button
              type="button"
              className="rounded-md border border-white px-3.5 py-2 text-[13px] font-semibold text-white transition hover:bg-white/10"
              onClick={start}
            >
              {c.getStarted}
            </button>
          </>
        )}
        <button
          type="button"
          className="rounded-md p-2 text-white hover:bg-white/10 md:hidden"
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen(v => !v)}
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>
    </IndiaAppBar>
  );
}
