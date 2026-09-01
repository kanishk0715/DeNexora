import { DEMO_SKILLS } from '../data/demo';
import { SiteNav } from '../components/layout/SiteNav';
import { SiteFooter } from '../components/layout/SiteFooter';
import { MatchBar } from '../components/ui/Primitives';

export default function PublicPortfolioPage() {
  return (
    <div className="flex min-h-screen flex-col bg-cream-100">
      <SiteNav />
      <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-12">
        <div className="card overflow-hidden">
          <div className="bg-forest-800 px-6 py-8 text-cream-50">
            <p className="text-xs uppercase tracking-[0.16em] text-saffron-300">Public verified profile</p>
            <h1 className="mt-2 text-3xl font-bold">Ananya Sharma</h1>
            <p className="mt-1 text-sm text-cream-200">BAMS · NIA Jaipur · Placement readiness 84</p>
          </div>
          <ul className="space-y-4 p-6">
            {DEMO_SKILLS.filter(s => s.verified).map(s => (
              <li key={s.name}>
                <div className="mb-1 flex justify-between text-sm">
                  <span>{s.name}</span>
                  <span className="font-semibold text-forest-700">{s.score} · verified</span>
                </div>
                <MatchBar score={s.score} />
              </li>
            ))}
          </ul>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
