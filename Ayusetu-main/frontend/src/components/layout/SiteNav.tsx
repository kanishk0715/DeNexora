import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { IndiaAppBar, MinistryLogo } from '../brand/IndiaMark';
import { useAuth } from '../../contexts/AuthContext';
import { useLocale } from '../../contexts/LocaleContext';
import { COPY } from '../../i18n/public';
import { LanguageSelect } from './LanguageSelect';

export function SiteNav({ onGetStarted }: { onGetStarted?: () => void }) {
  const { user } = useAuth();
  const { lang } = useLocale();
  const location = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const onLanding = location.pathname === '/';
  const c = COPY[lang].nav;

  const href = (hash: string) => (onLanding ? `#${hash}` : `/#${hash}`);

  const start = () => {
    setOpen(false);
    if (onGetStarted) onGetStarted();
    else navigate('/?start=1');
  };

  const links: { to?: string; hash?: string; label: string }[] = [
    { to: '/', label: c.home || 'Home' },
    { hash: 'how-it-works', label: c.how },
    { hash: 'for-you', label: c.forYou },
    { hash: 'features', label: c.features },
    { to: '/about', label: c.about },
    { hash: 'workspaces', label: c.workspaces },
  ];

  const NavItems = ({ onClick }: { onClick?: () => void }) => (
    <>
      {links.map(l =>
        l.to ? (
          <Link
            key={l.to}
            to={l.to}
            onClick={onClick}
            className={`rounded-lg px-3 py-2 text-sm font-semibold text-[#0b5c3a] transition hover:bg-[#e8f3ee] ${
              location.pathname === l.to ? 'bg-[#e8f3ee]' : ''
            }`}
          >
            {l.label}
          </Link>
        ) : (
          <a
            key={l.hash}
            href={href(l.hash!)}
            onClick={onClick}
            className="rounded-lg px-3 py-2 text-sm font-semibold text-[#0b5c3a] transition hover:bg-[#e8f3ee]"
          >
            {l.label}
          </a>
        ),
      )}
    </>
  );

  return (
    <IndiaAppBar
      after={
        open ? (
          <div className="border-b border-[#e4f4ea] bg-white px-4 py-3 lg:hidden">
            <nav className="flex flex-col gap-1" aria-label="Mobile">
              <NavItems onClick={() => setOpen(false)} />
            </nav>
          </div>
        ) : null
      }
    >
      <Link to="/" className="flex shrink-0 items-center" aria-label="Ministry of Ayush home">
        <MinistryLogo />
      </Link>

      <nav className="hidden items-center gap-0.5 lg:flex" aria-label="Primary">
        <NavItems />
      </nav>

      <div className="flex items-center gap-1 sm:gap-2">
        <LanguageSelect />
        {user ? (
          <Link to="/dashboard" className="btn-primary !bg-[#0b5c3a] hover:!bg-[#084830]">
            {c.openWorkspace}
          </Link>
        ) : (
          <>
            <Link
              to="/login"
              className="rounded-xl px-3 py-2 text-sm font-semibold text-[#0b5c3a] transition hover:bg-[#e8f3ee] sm:px-4 sm:py-2.5"
            >
              {c.login}
            </Link>
            <button
              type="button"
              className="btn-primary !bg-[#0b5c3a] px-3 py-2 hover:!bg-[#084830] sm:px-5 sm:py-2.5"
              onClick={start}
            >
              {c.getStarted}
            </button>
          </>
        )}
        <button
          type="button"
          className="rounded-lg p-2 text-[#0b5c3a] hover:bg-[#e8f3ee] lg:hidden"
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen(v => !v)}
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>
    </IndiaAppBar>
  );
}
