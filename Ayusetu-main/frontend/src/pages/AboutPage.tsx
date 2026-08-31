import { Link } from 'react-router-dom';
import { BadgeCheck, Brain, GitCompare, ShieldCheck } from 'lucide-react';
import { SiteNav } from '../components/layout/SiteNav';
import { SiteFooter } from '../components/layout/SiteFooter';
import { useLocale } from '../contexts/LocaleContext';
import { COPY } from '../i18n/public';

export default function AboutPage() {
  const { lang } = useLocale();
  const c = COPY[lang].about;

  return (
    <div className="flex min-h-screen flex-col bg-cream-100 text-ink-900">
      <SiteNav />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-14">
        <p className="text-xs font-semibold uppercase tracking-wide text-saffron-600">{c.kicker}</p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-ink-900 sm:text-4xl">{c.title}</h1>
        <p className="mt-4 text-base leading-relaxed text-ink-500">{c.lead}</p>

        <section className="card mt-10 p-6 sm:p-8">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-forest-50 text-forest-700">
            <GitCompare size={20} />
          </div>
          <h2 className="mt-4 text-xl font-bold text-ink-900">{c.matchTitle}</h2>
          <p className="mt-2 text-sm leading-relaxed text-ink-500">{c.matchBody}</p>
          <ul className="mt-5 space-y-3 text-sm text-ink-700">
            {c.matchPoints.map(p => (
              <li key={p} className="flex gap-2">
                <BadgeCheck size={18} className="mt-0.5 shrink-0 text-forest-600" />
                {p}
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-bold text-ink-900">{c.whoTitle}</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {c.who.map(w => (
              <article key={w.t} className="card p-5">
                <h3 className="font-semibold text-forest-800">{w.t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-500">{w.b}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="card mt-10 p-6 sm:p-8">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-saffron-50 text-saffron-700">
            <ShieldCheck size={20} />
          </div>
          <h2 className="mt-4 text-xl font-bold text-ink-900">{c.trustTitle}</h2>
          <p className="mt-2 text-sm leading-relaxed text-ink-500">{c.trustBody}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link to="/?start=1" className="btn-primary">
              {COPY[lang].nav.getStarted}
            </Link>
            <Link to="/" className="btn-secondary">
              {COPY[lang].hero.how}
            </Link>
          </div>
        </section>

        <p className="mt-8 flex items-center gap-2 text-xs text-ink-500">
          <Brain size={14} /> AyuSetu · {COPY[lang].hero.badge}
        </p>
      </main>
      <SiteFooter />
    </div>
  );
}
