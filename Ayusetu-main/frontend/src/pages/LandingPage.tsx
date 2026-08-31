import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  BadgeCheck,
  BarChart3,
  Brain,
  Briefcase,
  Building2,
  GraduationCap,
  ShieldCheck,
  X,
} from 'lucide-react';
import { Logo } from '../components/Logo';
import { useAuth } from '../contexts/AuthContext';
import type { User } from '../types/api';
import LiveMatchCard from '../components/landing/LiveMatchCard';

const PILLARS = [
  { icon: GraduationCap, t: 'Student profiles', b: 'Verified academics, certificates and AYUSH clinical skills in one place.' },
  { icon: Building2, t: 'Industry portal', b: 'Hospitals and wellness centres post real internship and hiring needs.' },
  { icon: Brain, t: 'AI skill mapping', b: 'Match scores against requirements, with gaps shown clearly.' },
  { icon: Briefcase, t: 'Placement tracker', b: 'Apply, shortlist, interview and confirm offers end to end.' },
  { icon: BarChart3, t: 'Analytics', b: 'Skill-gap and placement reports for institutes and the ministry.' },
];

const DEMO_ROLES: { role: User['role']; label: string; hint: string }[] = [
  { role: 'student', label: 'Student', hint: 'Match internships and track applications' },
  { role: 'institution', label: 'Institute', hint: 'Verify students and view placements' },
  { role: 'admin', label: 'Ministry of AYUSH', hint: 'National skill and placement insights' },
];

const QUESTIONS: Record<string, { id: string; label: string; options: string[] }[]> = {
  student: [
    { id: 'stream', label: 'Which AYUSH stream are you in?', options: ['BAMS', 'BNYS', 'BUMS', 'BSMS', 'BHMS'] },
    { id: 'year', label: 'Which year are you in?', options: ['1st year', '2nd year', '3rd year', 'Final year', 'Internship'] },
    { id: 'goal', label: 'What are you looking for?', options: ['Internship', 'Job / placement', 'Both'] },
    { id: 'skill', label: 'Which skill is your strongest today?', options: ['Panchakarma', 'Yoga therapy', 'Clinical documentation', 'Pharmacy / dravyaguna'] },
  ],
  institution: [
    { id: 'type', label: 'What kind of institute is this?', options: ['National institute (NIA / AIIA / NIH / NIS / NIUM)', 'State government college', 'Private AYUSH college'] },
    { id: 'stream', label: 'Primary stream you want to map?', options: ['BAMS', 'BNYS', 'BUMS', 'BSMS', 'BHMS', 'More than one'] },
    { id: 'goal', label: 'What do you need first?', options: ['Verify student credentials', 'Track internships & placements', 'See skill gaps vs industry'] },
    { id: 'size', label: 'Approx. student strength?', options: ['Under 200', '200–500', '500+'] },
  ],
  admin: [
    { id: 'cell', label: 'Which cell are you viewing for?', options: ['Skill mapping', 'Internships & training', 'Placement data', 'Policy / curriculum'] },
    { id: 'stream', label: 'Which stream should the dashboard emphasise?', options: ['All AYUSH streams', 'Ayurveda', 'Yoga', 'Unani', 'Siddha', 'Homoeopathy'] },
    { id: 'need', label: 'What do you need to see first?', options: ['State-wise internships', 'National skill-gap report', 'Institute onboarding status'] },
    { id: 'region', label: 'Geographic focus?', options: ['All India', 'North', 'South', 'East', 'West'] },
  ],
};

export default function LandingPage() {
  const { enterDemo } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [role, setRole] = useState<User['role'] | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const questions = role ? QUESTIONS[role] ?? [] : [];
  const complete = questions.length > 0 && questions.every(q => answers[q.id]);
  const roleMeta = DEMO_ROLES.find(r => r.role === role);

  const reset = () => {
    setOpen(false);
    setRole(null);
    setAnswers({});
  };

  const begin = (next: User['role']) => {
    setRole(next);
    setAnswers({});
    setOpen(true);
  };

  const finish = () => {
    if (!role || !complete) return;
    sessionStorage.setItem('ayusetu-onboarding', JSON.stringify({ role, answers }));
    enterDemo(role);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-cream-100 text-ink-900">
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4" onClick={reset}>
          <div
            className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-card"
            onClick={e => e.stopPropagation()}
            role="dialog"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-forest-600">Get started</p>
                <h2 className="mt-1 text-xl font-bold text-ink-900">
                  {role ? `A few questions · ${roleMeta?.label}` : 'Choose your role'}
                </h2>
                <p className="mt-1 text-sm text-ink-500">
                  {role ? 'This helps AyuSetu open the right workspace.' : 'Then we will ask a short set of questions.'}
                </p>
              </div>
              <button type="button" className="rounded-lg p-1 text-ink-500 hover:bg-slate-100" onClick={reset} aria-label="Close">
                <X size={18} />
              </button>
            </div>

            {!role && (
              <div className="mt-5 grid gap-3">
                {DEMO_ROLES.map(r => (
                  <button
                    key={r.role}
                    type="button"
                    onClick={() => begin(r.role)}
                    className="rounded-xl border border-slate-200 p-4 text-left transition hover:border-forest-400 hover:bg-forest-50"
                  >
                    <p className="font-semibold text-ink-900">{r.label}</p>
                    <p className="mt-1 text-sm text-ink-500">{r.hint}</p>
                  </button>
                ))}
              </div>
            )}

            {role && (
              <form
                className="mt-5 space-y-5"
                onSubmit={e => {
                  e.preventDefault();
                  finish();
                }}
              >
                {questions.map((q, i) => (
                  <fieldset key={q.id}>
                    <legend className="text-sm font-semibold text-ink-900">
                      {i + 1}. {q.label}
                    </legend>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {q.options.map(opt => (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => setAnswers(a => ({ ...a, [q.id]: opt }))}
                          className={`rounded-full border px-3 py-1.5 text-sm ${
                            answers[q.id] === opt
                              ? 'border-forest-600 bg-forest-600 text-white'
                              : 'border-slate-200 bg-white text-ink-700 hover:border-forest-300'
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </fieldset>
                ))}
                <div className="flex gap-2 pt-2">
                  <button type="button" className="btn-secondary" onClick={() => { setRole(null); setAnswers({}); }}>
                    Back
                  </button>
                  <button type="submit" className="btn-primary flex-1" disabled={!complete}>
                    Continue to workspace
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3.5">
          <Logo />
          <button type="button" className="btn-primary" onClick={() => { setRole(null); setAnswers({}); setOpen(true); }}>
            Get started
          </button>
        </div>
      </header>

      <section className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-14 lg:grid-cols-2 lg:py-20">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <p className="inline-flex rounded-full bg-forest-50 px-3 py-1 text-xs font-semibold text-forest-700">
            AYUSH skill bridge
          </p>
          <h1 className="mt-5 text-4xl font-bold leading-tight tracking-tight text-ink-900 sm:text-5xl">
            Match real clinical skills to the right internship.
          </h1>
          <p className="mt-4 max-w-lg text-base leading-relaxed text-ink-500">
            AyuSetu connects AYUSH students, hospitals and institutes — with verified profiles, AI matching and a clear placement pipeline.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <button type="button" className="btn-primary" onClick={() => { setRole(null); setAnswers({}); setOpen(true); }}>
              Get started <ArrowRight size={16} />
            </button>
          </div>
          <div className="mt-8 flex flex-wrap gap-5 text-sm text-ink-500">
            <span className="flex items-center gap-2">
              <ShieldCheck size={16} className="text-forest-600" /> DPDP consent
            </span>
            <span className="flex items-center gap-2">
              <BadgeCheck size={16} className="text-forest-600" /> Verified credentials
            </span>
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <LiveMatchCard />
        </motion.div>
      </section>

      <section className="border-y border-slate-200 bg-white py-16">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-2xl font-bold text-ink-900">How it works</h2>
          <p className="mt-2 text-sm text-ink-500">One loop from profile to placement.</p>
          <ol className="mt-8 grid gap-4 sm:grid-cols-5">
            {['Profile', 'Posting', 'Match', 'Apply', 'Offer'].map((s, i) => (
              <li key={s} className="rounded-2xl border border-slate-100 bg-cream-100 p-4">
                <span className="text-xs font-bold text-forest-600">0{i + 1}</span>
                <p className="mt-2 font-semibold text-ink-900">{s}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-2xl font-bold text-ink-900">Built for the full AYUSH pathway</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {PILLARS.map(p => {
            const Icon = p.icon;
            return (
              <article key={p.t} className="card-hover p-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-forest-50 text-forest-700">
                  <Icon size={20} />
                </div>
                <h3 className="mt-4 font-semibold text-ink-900">{p.t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-500">{p.b}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section id="demo" className="border-t border-slate-200 bg-white py-16">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-2xl font-bold text-ink-900">Open a workspace</h2>
          <p className="mt-2 text-sm text-ink-500">Choose a role, answer a few questions, then enter.</p>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {DEMO_ROLES.map(r => (
              <button key={r.role} type="button" onClick={() => begin(r.role)} className="card-hover p-5 text-left">
                <p className="text-lg font-bold text-forest-800">{r.label}</p>
                <p className="mt-1 text-sm text-ink-500">{r.hint}</p>
                <p className="mt-4 text-sm font-semibold text-forest-600">Start →</p>
              </button>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-200 py-8 text-sm text-ink-500">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 sm:flex-row sm:justify-between">
          <span className="font-semibold text-forest-800">AyuSetu</span>
          <span>Skill mapping · internships · placement</span>
        </div>
      </footer>
    </div>
  );
}
