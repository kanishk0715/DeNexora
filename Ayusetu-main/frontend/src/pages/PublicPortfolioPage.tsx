import { DEMO_SKILLS } from '../data/demo';
import { Logo } from '../components/Logo';

export default function PublicPortfolioPage() {
  return (
    <div className="min-h-screen bg-cream-100 px-4 py-10">
      <div className="mx-auto max-w-2xl">
        <Logo />
        <div className="card mt-6 overflow-hidden">
          <div className="bg-forest-800 px-6 py-8 text-cream-50">
            <p className="text-xs uppercase tracking-[0.16em] text-saffron-300">Public verified profile</p>
            <h1 className="mt-2 font-serif text-3xl">Ananya Sharma</h1>
            <p className="mt-1 text-sm text-cream-200">BAMS · NIA Jaipur · Placement readiness 84</p>
          </div>
          <ul className="space-y-2 p-6 text-sm">
            {DEMO_SKILLS.filter(s => s.verified).map(s => (
              <li key={s.name} className="flex justify-between">
                <span>{s.name}</span>
                <span className="font-semibold text-forest-700">{s.score} · verified</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
