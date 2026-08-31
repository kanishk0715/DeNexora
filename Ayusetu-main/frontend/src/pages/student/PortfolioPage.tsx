import { PageHeader } from '../../components/ui/Primitives';
import { DEMO_SKILLS } from '../../data/demo';
import { useAuth } from '../../contexts/AuthContext';

export default function PortfolioPage() {
  const { user } = useAuth();
  return (
    <div>
      <PageHeader
        kicker="Verified credential layer"
        title="Digital AYUSH profile"
        subtitle="Share a public link with hospitals. Unverified items stay hidden unless you opt in."
      />
      <div className="card overflow-hidden">
        <div className="bg-forest-800 px-6 py-8 text-cream-50">
          <p className="text-xs uppercase tracking-[0.16em] text-saffron-300">AyuSetu verified profile</p>
          <h2 className="mt-2 font-serif text-3xl">{user?.name}</h2>
          <p className="mt-1 text-sm text-cream-200">BAMS · National Institute of Ayurveda, Jaipur · Cohort 2026</p>
          <p className="mt-4 text-sm">
            Public link: <span className="font-mono text-saffron-300">/p/ananya-sharma</span>
          </p>
        </div>
        <div className="grid gap-6 p-6 md:grid-cols-2">
          <div>
            <h3 className="font-semibold text-forest-900">Skills</h3>
            <ul className="mt-3 space-y-2">
              {DEMO_SKILLS.map(s => (
                <li key={s.name} className="flex justify-between text-sm">
                  <span>{s.name}</span>
                  <span className={s.verified ? 'text-forest-700' : 'text-stone-400'}>
                    {s.score} {s.verified ? '· verified' : '· pending'}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-forest-900">Clinical exposure</h3>
            <ul className="mt-3 space-y-3 text-sm text-ink-700">
              <li>Panchakarma theatre observership — AIIA (120 hrs) · verified</li>
              <li>Community yoga NCD camp — MDNIY · verified</li>
              <li>Self-declared: Ayurveda dietetics workshop · hidden on public view</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
