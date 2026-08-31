import { Link } from 'react-router-dom';
import { SiteNav } from './layout/SiteNav';
import { SiteFooter } from './layout/SiteFooter';

function StatusPage({
  code,
  title,
  body,
  action,
}: {
  code: string;
  title: string;
  body: string;
  action: { to: string; label: string };
}) {
  return (
    <div className="flex min-h-screen flex-col bg-cream-100 text-ink-900">
      <SiteNav />
      <main className="mx-auto flex w-full max-w-lg flex-1 flex-col items-center justify-center px-4 py-16 text-center">
        <p className="text-xs font-semibold uppercase tracking-wide text-saffron-600">AyuSetu</p>
        <p className="mt-3 text-6xl font-bold text-forest-800">{code}</p>
        <h1 className="mt-4 text-2xl font-bold tracking-tight text-ink-900">{title}</h1>
        <p className="mt-3 text-sm leading-relaxed text-ink-500">{body}</p>
        <Link to={action.to} className="btn-primary mt-8">
          {action.label}
        </Link>
      </main>
      <SiteFooter />
    </div>
  );
}

export function ForbiddenPage() {
  return (
    <StatusPage
      code="403"
      title="This workspace is for a different role"
      body="AyuSetu keeps student, hospital, institute and ministry views separate. Open your own workspace, or go back to the public site."
      action={{ to: '/dashboard', label: 'Back to overview' }}
    />
  );
}

export function NotFoundPage() {
  return (
    <StatusPage
      code="404"
      title="This page isn’t on AyuSetu"
      body="The link may be outdated, or this path isn’t part of the prototype. Return home to match internships or open a workspace."
      action={{ to: '/', label: 'Back to home' }}
    />
  );
}
