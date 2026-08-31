import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { Logo } from '../Logo';
import { useAuth } from '../../contexts/AuthContext';
import { useLocale } from '../../contexts/LocaleContext';
import { COPY } from '../../i18n/public';

export function SiteNav({ onGetStarted }: { onGetStarted?: () => void }) {
  const { user } = useAuth();
  const { lang, toggleLang } = useLocale();
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
            className={`rounded-lg px-3 py-2 text-sm font-medium transition hover:bg-cream-100 hover:text-forest-800 ${
              location.pathname === l.to ? 'text-forest-800' : 'text-ink-700'
            }`}
          >
            {l.label}
          </Link>
        ) : (
          <a
            key={l.hash}
            href={href(l.hash!)}
            onClick={onClick}
            className="rounded-lg px-3 py-2 text-sm font-medium text-ink-700 transition hover:bg-cream-100 hover:text-forest-800"
          >
            {l.label}
          </a>
        ),
      )}
    </>
  );

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
        <Link to="/" className="shrink-0" aria-label="AyuSetu home">
          <Logo />
        </Link>

        <nav className="hidden items-center gap-0.5 lg:flex" aria-label="Primary">
          <NavItems />
        </nav>

        <div className="flex items-center gap-1 sm:gap-2">
          <button
            type="button"
            onClick={toggleLang}
            className="rounded-xl border border-slate-200 px-2.5 py-1.5 text-xs font-semibold text-forest-800 hover:bg-cream-100"
            aria-label={lang === 'en' ? 'Switch to Hindi' : 'Switch to English'}
          >
            {lang === 'en' ? 'हिन्दी' : 'EN'}
          </button>
          {user ? (
            <Link to="/dashboard" className="btn-primary">
              {c.openWorkspace}
            </Link>
          ) : (
            <>
              <Link
                to="/login"
                className="rounded-xl px-3 py-2 text-sm font-semibold text-forest-800 transition hover:bg-cream-100 sm:px-4 sm:py-2.5"
              >
                {c.login}
              </Link>
              <button type="button" className="btn-primary px-3 py-2 sm:px-5 sm:py-2.5" onClick={start}>
                {c.getStarted}
              </button>
            </>
          )}
          <button
            type="button"
            className="rounded-lg p-2 text-ink-700 hover:bg-cream-100 lg:hidden"
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen(v => !v)}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-slate-100 bg-white px-4 py-3 lg:hidden">
          <nav className="flex flex-col gap-1" aria-label="Mobile">
            <NavItems onClick={() => setOpen(false)} />
          </nav>
        </div>
      )}
    </header>
  );
}
