import { Link } from 'react-router-dom';
import { Logo } from '../Logo';
import { useLocale } from '../../contexts/LocaleContext';
import { COPY } from '../../i18n/public';

export function SiteFooter() {
  const { lang } = useLocale();
  const c = COPY[lang].footer;
  const n = COPY[lang].nav;

  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div className="sm:col-span-2 lg:col-span-1">
          <Logo />
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-ink-500">{c.blurb}</p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-ink-500">{c.platform}</p>
          <ul className="mt-3 space-y-2 text-sm text-ink-700">
            <li>
              <a href="/#how-it-works" className="hover:text-forest-700">
                {n.how}
              </a>
            </li>
            <li>
              <a href="/#features" className="hover:text-forest-700">
                {n.features}
              </a>
            </li>
            <li>
              <Link to="/about" className="hover:text-forest-700">
                {c.about}
              </Link>
            </li>
            <li>
              <a href="/#workspaces" className="hover:text-forest-700">
                {n.workspaces}
              </a>
            </li>
          </ul>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-ink-500">{c.getIn}</p>
          <ul className="mt-3 space-y-2 text-sm text-ink-700">
            <li>
              <Link to="/login" className="hover:text-forest-700">
                {c.login}
              </Link>
            </li>
            <li>
              <Link to="/register" className="hover:text-forest-700">
                {c.register}
              </Link>
            </li>
            <li>
              <Link to="/p/ananya-sharma" className="hover:text-forest-700">
                {c.portfolio}
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-ink-500">{c.aligned}</p>
          <ul className="mt-3 space-y-2 text-sm text-ink-500">
            <li>{c.ministry}</li>
            <li>{c.institutes}</li>
            <li>{c.consent}</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-slate-100">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-5 text-xs text-ink-500 sm:flex-row sm:items-center sm:justify-between">
          <span>
            © {new Date().getFullYear()} AyuSetu · {c.copyright}
          </span>
          <span>{c.sih}</span>
        </div>
      </div>
    </footer>
  );
}
