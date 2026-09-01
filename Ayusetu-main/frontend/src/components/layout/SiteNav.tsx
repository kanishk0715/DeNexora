import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Logo } from '../Logo';
import { useAuth } from '../../contexts/AuthContext';
import { useLocale } from '../../contexts/LocaleContext';
import { COPY } from '../../i18n/public';
import { TirangaBar } from './TirangaBar';

export function SiteNav({ onGetStarted }: { onGetStarted?: () => void }) {
  const { user } = useAuth();
  const { lang, toggleLang } = useLocale();
  const location = useLocation();
  const navigate = useNavigate();
  const onLanding = location.pathname === '/';
  const c = COPY[lang].nav;

  const activeHash = location.hash.replace('#', '');

  const start = () => {
    if (onGetStarted) onGetStarted();
    else navigate('/?start=1');
  };

  const links: { to?: string; hash?: string; label: string }[] = [
    { to: '/', label: c.home },
    { hash: 'how-it-works', label: c.how },
    { hash: 'for-you', label: c.forYou },
    { hash: 'features', label: c.features },
    { to: '/about', label: c.about },
    { hash: 'workspaces', label: c.workspaces },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/95 shadow-sm backdrop-blur">
      <TirangaBar />
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4">
        <Link to="/" className="shrink-0" aria-label="AyuSetu home">
          <Logo />
        </Link>

        <div className="flex shrink-0 items-center gap-1 sm:gap-2">
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
        </div>
      </div>

      <nav className="border-t border-slate-100 bg-cream-50/80" aria-label="Primary">
        <div className="mx-auto flex max-w-6xl items-center gap-0.5 overflow-x-auto px-2 py-1.5 sm:justify-center sm:px-4">
          {links.map(l => {
            const active = l.to
              ? location.pathname === l.to && (l.to !== '/' || !activeHash)
              : onLanding && activeHash === l.hash;
            const className = `whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium transition hover:bg-white hover:text-forest-800 ${
              active ? 'bg-white text-forest-800 shadow-sm' : 'text-ink-700'
            }`;
            return l.to ? (
              <Link key={l.to} to={l.to} className={className}>
                {l.label}
              </Link>
            ) : (
              <Link
                key={l.hash}
                to={{ pathname: '/', hash: l.hash }}
                className={className}
                onClick={() => {
                  if (onLanding) {
                    document.getElementById(l.hash!)?.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
              >
                {l.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </header>
  );
}
