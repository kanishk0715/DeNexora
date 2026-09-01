import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  BadgeCheck,
  BarChart3,
  Brain,
  Briefcase,
  Building2,
  GraduationCap,
  Landmark,
  ShieldCheck,
  Stethoscope,
  BookOpen,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useLocale } from '../contexts/LocaleContext';
import type { User } from '../types/api';
import LiveMatchCard from '../components/landing/LiveMatchCard';
import { SiteNav } from '../components/layout/SiteNav';
import { SiteFooter } from '../components/layout/SiteFooter';
import { Modal } from '../components/ui/Primitives';
import { COPY, PARTNERS } from '../i18n/public';
import { CountUp } from '../components/ui/CountUp';
import { BAMS_SUBJECTS, ONBOARDING_KEY } from '../data/ayurvedaBank';

const ROLE_ICONS = {
  student: GraduationCap,
  academician: BookOpen,
  industry: Stethoscope,
  institution: Landmark,
  admin: ShieldCheck,
} as const;

const FEATURE_ICONS = [GraduationCap, Building2, Brain, Briefcase, BarChart3];

type EntryKind = 'student' | 'partners' | 'admin';

const ENTRY_DEFS: { kind: EntryKind; icon: typeof GraduationCap; role: User['role'] | null }[] = [
  { kind: 'student', icon: GraduationCap, role: 'student' },
  { kind: 'partners', icon: Building2, role: null },
  { kind: 'admin', icon: ShieldCheck, role: 'admin' },
];

function RoleTiles({
  labels,
  startLabel,
  onPick,
  selected,
}: {
  labels: Record<EntryKind, { label: string; hint: string }>;
  startLabel: string;
  onPick: (kind: EntryKind) => void;
  selected?: EntryKind;
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {ENTRY_DEFS.map(item => {
        const Icon = item.icon;
        const copy = labels[item.kind];
        const on = selected === item.kind;
        return (
          <button
            key={item.kind}
            type="button"
            onClick={() => onPick(item.kind)}
            className={`card-hover group p-6 text-left ${on ? 'border-forest-400 ring-2 ring-forest-600/20' : ''}`}
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-forest-50 text-forest-700">
              <Icon size={20} />
            </span>
            <p className="mt-4 text-lg font-bold text-forest-800">{copy.label}</p>
            <p className="mt-1 text-sm text-ink-500">{copy.hint}</p>
            <p className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-forest-600">
              {startLabel}
              <ArrowRight size={14} className="transition group-hover:translate-x-0.5" />
            </p>
          </button>
        );
      })}
    </div>
  );
}

const PARTNER_ROLES: User['role'][] = ['academician', 'industry', 'institution'];

type Gate = 'choose' | 'partner' | 'questions';

type Question = { id: string; label: string; options: string[]; multi?: boolean };

const QUESTIONS: Record<string, Question[]> = {
  student: [
    { id: 'stream', label: 'Which AYUSH stream are you in?', options: ['BAMS', 'BNYS', 'BUMS', 'BSMS', 'BHMS'] },
    { id: 'year', label: 'Which year are you in?', options: ['1st year', '2nd year', '3rd year', 'Final year', 'Internship'] },
    { id: 'goal', label: 'What are you looking for?', options: ['Internship', 'Job / placement', 'Both'] },
    {
      id: 'skill',
      label: 'Which BAMS subjects should we assess?',
      multi: true,
      options: BAMS_SUBJECTS.map(s => s.id),
    },
  ],
  academician: [
    { id: 'post', label: 'What is your primary role?', options: ['Faculty', 'HOD / coordinator', 'Research guide'] },
    { id: 'stream', label: 'Primary stream?', options: ['BAMS', 'BNYS', 'BUMS', 'BSMS', 'BHMS'] },
    { id: 'need', label: 'What do you want first?', options: ['Industry internship', 'FDP / workshop', 'Research collaboration'] },
    { id: 'type', label: 'Institute type?', options: ['National institute', 'State college', 'Private college'] },
  ],
  industry: [
    { id: 'org', label: 'What kind of organisation is this?', options: ['AYUSH hospital', 'Wellness centre', 'Research council', 'Pharmacy / manufacturing'] },
    { id: 'need', label: 'What are you hiring for?', options: ['Interns', 'Full-time roles', 'Both'] },
    {
      id: 'stream',
      label: 'Which streams do you need?',
      multi: true,
      options: ['Ayurveda', 'Yoga', 'Unani', 'Siddha', 'Homoeopathy'],
    },
    { id: 'city', label: 'Primary location?', options: ['Delhi NCR', 'Jaipur', 'Kochi', 'Hyderabad', 'Multi-city'] },
  ],
  institution: [
    { id: 'type', label: 'What kind of institute is this?', options: ['National institute (NIA / AIIA / NIH / NIS / NIUM)', 'State government college', 'Private AYUSH college'] },
    {
      id: 'stream',
      label: 'Which streams do you want to map?',
      multi: true,
      options: ['BAMS', 'BNYS', 'BUMS', 'BSMS', 'BHMS'],
    },
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

function studentQuestions(answers: Record<string, string | string[]>): Question[] {
  const base = QUESTIONS.student.filter(q => q.id !== 'skill');
  if (answers.stream === 'BAMS') return QUESTIONS.student;
  return base;
}

function answered(q: Question, answers: Record<string, string | string[]>) {
  const v = answers[q.id];
  if (q.multi) return Array.isArray(v) && v.length > 0;
  return typeof v === 'string' && v.length > 0;
}

export default function LandingPage() {
  const { enterDemo } = useAuth();
  const { lang } = useLocale();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [gate, setGate] = useState<Gate>('choose');
  const [role, setRole] = useState<User['role'] | null>(null);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [audienceKind, setAudienceKind] = useState<EntryKind>('student');
  const [howStep, setHowStep] = useState(0);
  const t = COPY[lang];

  const questions = role === 'student' ? studentQuestions(answers) : role ? QUESTIONS[role] ?? [] : [];
  const complete = questions.length > 0 && questions.every(q => answered(q, answers));
  const roleLabel = role ? t.roles[role].label : '';
  const partnerCopy = {
    label: 'Faculty, hospital & institute',
    hint: 'Teach, hire talent, or verify students on one AYUSH map',
  };
  const roleLabels: Record<EntryKind, { label: string; hint: string }> = {
    student: t.roles.student,
    partners: partnerCopy,
    admin: t.roles.admin,
  };
  const studentTab = t.audience.tabs[0];
  const hospitalTab = t.audience.tabs[1];
  const instituteTab = t.audience.tabs[2];
  const audienceDetail: Record<EntryKind, { heading: string; points: string[] }> = {
    student: { heading: studentTab.heading, points: studentTab.points },
    partners: {
      heading: 'One map for faculty, hospitals and institutes',
      points: [...hospitalTab.points, ...instituteTab.points],
    },
    admin: {
      heading: 'National skill and placement insights',
      points: [
        'See internships and jobs by state in one pulse',
        'Track institute onboarding and verified credentials',
        'Read skill-gap reports for curriculum and policy',
      ],
    },
  };
  const audience = audienceDetail[audienceKind];

  const reset = () => {
    setOpen(false);
    setGate('choose');
    setRole(null);
    setAnswers({});
  };

  const begin = (next: User['role']) => {
    setRole(next);
    setAnswers({});
    setGate('questions');
    setOpen(true);
  };

  const startEntry = (kind: 'student' | 'partners' | 'admin') => {
    setAnswers({});
    setOpen(true);
    if (kind === 'partners') {
      setRole(null);
      setGate('partner');
      return;
    }
    begin(kind === 'student' ? 'student' : 'admin');
  };

  const modalTitle = gate === 'questions' && role ? `${t.modal.questions} · ${roleLabel}` : gate === 'partner' ? partnerCopy.label : t.modal.choose;

  const modalHelp =
    gate === 'questions' && role === 'student'
      ? answers.stream === 'BAMS'
        ? 'Pick BAMS subjects. Assessment will only ask the papers you select.'
        : 'Choose your stream first. BAMS unlocks subject papers for assessment.'
      : gate === 'questions'
        ? t.modal.help
        : gate === 'partner'
          ? 'Choose how you work with AYUSH talent.'
          : t.modal.then;

  const finish = () => {
    if (!role || !complete) return;
    sessionStorage.setItem(ONBOARDING_KEY, JSON.stringify({ role, answers }));
    enterDemo(role);
    if (role === 'student' && answers.stream === 'BAMS') navigate('/assessment');
    else navigate('/dashboard');
  };

  useEffect(() => {
    if (new URLSearchParams(location.search).get('start') === '1') {
      setGate('choose');
      setRole(null);
      setAnswers({});
      setOpen(true);
    }
  }, [location.search]);

  useEffect(() => {
    const id = location.hash.replace('#', '');
    if (!id) return;
    const t = window.setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    }, 50);
    return () => window.clearTimeout(t);
  }, [location.hash]);

  return (
    <div className="flex min-h-screen flex-col bg-cream-100 text-ink-900">
      <Modal
        open={open}
        onClose={reset}
        kicker={t.modal.kicker}
        title={modalTitle}
        size="md"
      >
        <p className="-mt-3 mb-4 text-sm text-ink-500">{modalHelp}</p>
        {gate === 'choose' && (
          <div className="grid gap-3">
            {(
              [
                { kind: 'student' as const, role: 'student' as const, icon: GraduationCap },
                { kind: 'partners' as const, role: null, icon: Building2 },
                { kind: 'admin' as const, role: 'admin' as const, icon: ShieldCheck },
              ]
            ).map(item => {
              const Icon = item.icon;
              const label = item.kind === 'partners' ? partnerCopy.label : t.roles[item.role!].label;
              const hint = item.kind === 'partners' ? partnerCopy.hint : t.roles[item.role!].hint;
              return (
                <button
                  key={item.kind}
                  type="button"
                  onClick={() => startEntry(item.kind)}
                  className="group flex items-start gap-3 rounded-xl border border-slate-200 p-4 text-left transition hover:border-forest-400 hover:bg-forest-50"
                >
                  <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-forest-50 text-forest-700 group-hover:bg-white">
                    <Icon size={18} />
                  </span>
                  <span>
                    <p className="font-semibold text-ink-900">{label}</p>
                    <p className="mt-1 text-sm text-ink-500">{hint}</p>
                  </span>
                  <ArrowRight size={16} className="ml-auto mt-2 shrink-0 text-forest-600 opacity-0 transition group-hover:opacity-100" />
                </button>
              );
            })}
          </div>
        )}
        {gate === 'partner' && (
          <div className="grid gap-3">
            {PARTNER_ROLES.map(r => {
              const Icon = ROLE_ICONS[r];
              return (
                <button
                  key={r}
                  type="button"
                  onClick={() => begin(r)}
                  className="group flex items-start gap-3 rounded-xl border border-slate-200 p-4 text-left transition hover:border-forest-400 hover:bg-forest-50"
                >
                  <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-forest-50 text-forest-700 group-hover:bg-white">
                    <Icon size={18} />
                  </span>
                  <span>
                    <p className="font-semibold text-ink-900">{t.roles[r].label}</p>
                    <p className="mt-1 text-sm text-ink-500">{t.roles[r].hint}</p>
                  </span>
                  <ArrowRight size={16} className="ml-auto mt-2 shrink-0 text-forest-600 opacity-0 transition group-hover:opacity-100" />
                </button>
              );
            })}
            <button
              type="button"
              className="btn-secondary mt-1"
              onClick={() => {
                setGate('choose');
                setRole(null);
              }}
            >
              {t.modal.back}
            </button>
          </div>
        )}
        {gate === 'questions' && role && (
          <form
            className="space-y-5"
            onSubmit={e => {
              e.preventDefault();
              finish();
            }}
          >
            {questions.map((q, i) => {
                  const value = answers[q.id];
                  const picked = (opt: string) =>
                    q.multi ? Array.isArray(value) && value.includes(opt) : value === opt;
                  const opts =
                    q.id === 'skill'
                      ? BAMS_SUBJECTS.map(s => ({ id: s.id, label: s.label, hint: s.hint }))
                      : q.options.map(opt => ({ id: opt, label: opt, hint: '' }));
                  return (
                    <fieldset key={q.id}>
                      <legend className="text-sm font-semibold text-ink-900">
                        {i + 1}. {q.label}
                        {q.multi && <span className="ml-2 font-normal text-ink-500">Select all that apply</span>}
                      </legend>
                      <div className={`mt-2 flex flex-wrap gap-2 ${q.id === 'skill' ? 'flex-col sm:flex-row' : ''}`}>
                        {opts.map(opt => (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() =>
                              setAnswers(a => {
                                if (q.id === 'stream') {
                                  const next: Record<string, string | string[]> = { ...a, stream: opt.id };
                                  if (opt.id !== 'BAMS') delete next.skill;
                                  return next;
                                }
                                if (!q.multi) return { ...a, [q.id]: opt.id };
                                const cur = Array.isArray(a[q.id]) ? [...(a[q.id] as string[])] : [];
                                const next = cur.includes(opt.id) ? cur.filter(x => x !== opt.id) : [...cur, opt.id];
                                return { ...a, [q.id]: next };
                              })
                            }
                            className={`rounded-xl border px-3 py-1.5 text-left text-sm transition ${
                              q.id === 'skill' ? 'sm:w-[calc(50%-0.25rem)]' : 'rounded-full'
                            } ${
                              picked(opt.id)
                                ? 'border-forest-600 bg-forest-600 text-white'
                                : 'border-slate-200 bg-white text-ink-700 hover:border-forest-300'
                            }`}
                          >
                            <span className="font-medium">{opt.label}</span>
                            {opt.hint ? (
                              <span className={`mt-0.5 block text-[11px] ${picked(opt.id) ? 'text-white/80' : 'text-ink-500'}`}>
                                {opt.hint}
                              </span>
                            ) : null}
                          </button>
                        ))}
                      </div>
                    </fieldset>
                  );
                })}
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                className="btn-secondary"
                onClick={() => {
                  setAnswers({});
                  if (PARTNER_ROLES.includes(role)) {
                    setRole(null);
                    setGate('partner');
                  } else {
                    setRole(null);
                    setGate('choose');
                  }
                }}
              >
                {t.modal.back}
              </button>
              <button type="submit" className="btn-primary flex-1" disabled={!complete}>
                {role === 'student' && answers.stream === 'BAMS' ? 'Start subject assessment' : t.modal.continue}
              </button>
            </div>
          </form>
        )}
      </Modal>

      <SiteNav
        onGetStarted={() => {
          setGate('choose');
          setRole(null);
          setAnswers({});
          setOpen(true);
        }}
      />

      <main className="flex-1">
        <section className="relative overflow-hidden">
          <div className="pointer-events-none absolute inset-0">
            <img
              src="/ayurveda-hero.jpg"
              alt=""
              className="h-full w-full object-cover object-[center_38%] opacity-[0.68]"
            />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(250,246,240,0.70)_0%,_rgba(250,246,240,0.42)_50%,_rgba(250,246,240,0.18)_100%)]" />
            <div className="absolute inset-0 bg-gradient-to-b from-cream-100/25 via-transparent to-cream-100" />
          </div>
          <div className="relative h-1.5 bg-[linear-gradient(90deg,_#c45c26_0%,_#c45c26_34%,_#faf6f0_34%,_#faf6f0_66%,_#16553d_66%)]" />
          <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-4 pb-16 pt-12 lg:grid-cols-2 lg:pb-20 lg:pt-16">
            <div className="text-center lg:text-left">
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex rounded-full border border-saffron-100 bg-saffron-50/90 px-3 py-1 text-xs font-semibold text-saffron-700 shadow-sm"
            >
              {t.hero.badge}
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="mt-5 font-serif text-4xl font-semibold leading-[1.15] tracking-tight text-ink-900 sm:text-5xl lg:text-[3.15rem]"
            >
              {t.hero.title}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-ink-500 lg:mx-0"
            >
              {t.hero.body}
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.16 }}
              className="mt-8 flex flex-wrap items-center justify-center gap-3 lg:justify-start"
            >
              <button
                type="button"
                className="btn-primary"
                onClick={() => {
                  setGate('choose');
                  setRole(null);
                  setAnswers({});
                  setOpen(true);
                }}
              >
                {t.hero.getStarted} <ArrowRight size={16} />
              </button>
              <a href="#how-it-works" className="btn-secondary">
                {t.hero.how}
              </a>
            </motion.div>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-5 text-sm text-ink-500 lg:justify-start">
              <span className="flex items-center gap-2">
                <ShieldCheck size={16} className="text-forest-600" /> {t.hero.consent}
              </span>
              <span className="flex items-center gap-2">
                <BadgeCheck size={16} className="text-forest-600" /> {t.hero.verified}
              </span>
            </div>
            </div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mx-auto w-full max-w-xl lg:mx-0"
          >
            <LiveMatchCard />
          </motion.div>
          </div>
        </section>

        <section id="roles" className="relative z-[1] mx-auto max-w-6xl scroll-mt-24 px-4 py-12 sm:py-14">
          <p className="text-center text-xs font-semibold uppercase tracking-wide text-forest-600">{t.modal.kicker}</p>
          <h2 className="mt-2 text-center font-serif text-2xl font-semibold text-ink-900 sm:text-3xl">{t.modal.choose}</h2>
          <p className="mx-auto mt-2 max-w-lg text-center text-sm text-ink-500">{t.modal.then}</p>
          <div className="mt-8">
            <RoleTiles labels={roleLabels} startLabel={t.workspaces.start} onPick={startEntry} />
          </div>
        </section>

        <section className="relative z-[1] border-y border-slate-200 bg-white/90 py-10 backdrop-blur-sm">
          <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-4 sm:grid-cols-4">
            {t.stats.map(s => (
              <div key={s.l} className="text-center">
                <p className="font-serif text-2xl font-semibold tabular-nums text-forest-800 sm:text-3xl">
                  <CountUp value={s.n} />
                </p>
                <p className="mt-1 text-xs font-medium text-ink-500 sm:text-sm">{s.l}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="partners" className="scroll-mt-24 py-12">
          <div className="mx-auto max-w-6xl px-4">
            <p className="text-center text-xs font-semibold uppercase tracking-wide text-saffron-600">{t.partners.kicker}</p>
            <h2 className="mt-2 text-center text-lg font-bold text-ink-900 sm:text-xl">{t.partners.title}</h2>
            <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
              {PARTNERS.map(p => (
                <article
                  key={p.ab}
                  className="card group flex flex-col items-center px-3 py-4 text-center transition hover:-translate-y-0.5 hover:border-forest-200 hover:shadow-md"
                >
                  <span className="text-sm font-bold tracking-wide text-forest-800">{p.ab}</span>
                  <span className="mt-1 line-clamp-2 text-[11px] leading-snug text-ink-500">{p.name}</span>
                  <span className="mt-1 text-[10px] text-ink-500">{p.city}</span>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="for-you" className="scroll-mt-24 border-y border-slate-200 bg-white py-16">
          <div className="mx-auto max-w-6xl px-4">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-xs font-semibold uppercase tracking-wide text-forest-600">{t.audience.kicker}</p>
              <h2 className="mt-2 font-serif text-2xl font-semibold text-ink-900 sm:text-3xl">{t.audience.title}</h2>
              <p className="mt-2 text-sm text-ink-500">{t.audience.subtitle}</p>
            </div>
            <div className="mt-8">
              <RoleTiles labels={roleLabels} startLabel="See how it fits" selected={audienceKind} onPick={setAudienceKind} />
            </div>
            <motion.div key={audienceKind} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mx-auto mt-8 max-w-2xl card p-8">
              <h3 className="text-lg font-bold text-ink-900">{audience.heading}</h3>
              <ul className="mt-4 space-y-3 text-sm text-ink-700">
                {audience.points.map(p => (
                  <li key={p} className="flex gap-2">
                    <BadgeCheck size={18} className="mt-0.5 shrink-0 text-forest-600" />
                    {p}
                  </li>
                ))}
              </ul>
              <button type="button" className="btn-primary mt-6" onClick={() => startEntry(audienceKind)}>
                {t.hero.getStarted} <ArrowRight size={16} />
              </button>
            </motion.div>
          </div>
        </section>

        <section id="how-it-works" className="scroll-mt-24 py-16">
          <div className="mx-auto max-w-6xl px-4">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="font-serif text-2xl font-semibold text-ink-900 sm:text-3xl">{t.how.title}</h2>
              <p className="mt-2 text-sm text-ink-500">{t.how.subtitle}</p>
            </div>
            <ol className="mt-10 grid gap-4 sm:grid-cols-5">
              {t.how.steps.map((s, i) => (
                <motion.li
                  key={s.t}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06 }}
                  onClick={() => setHowStep(i)}
                  onMouseEnter={() => setHowStep(i)}
                  className={`card cursor-pointer p-5 text-center transition sm:text-left ${
                    howStep === i ? 'border-forest-300 ring-2 ring-forest-600/15' : 'hover:border-forest-200'
                  }`}
                >
                  <span className="text-xs font-bold text-forest-600">0{i + 1}</span>
                  <p className="mt-2 font-semibold text-ink-900">{s.t}</p>
                  <p className="mt-1 text-sm text-ink-500">{s.b}</p>
                </motion.li>
              ))}
            </ol>
            <p className="mt-8 text-center">
              <Link to="/about" className="text-sm font-semibold text-forest-700 hover:underline">
                {t.footer.about} →
              </Link>
            </p>
          </div>
        </section>

        <section id="features" className="scroll-mt-24 border-y border-slate-200 bg-white py-16">
          <div className="mx-auto max-w-6xl px-4">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="font-serif text-2xl font-semibold text-ink-900 sm:text-3xl">{t.features.title}</h2>
              <p className="mt-2 text-sm text-ink-500">{t.features.subtitle}</p>
            </div>
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {t.features.items.map((p, i) => {
                const Icon = FEATURE_ICONS[i] ?? Brain;
                return (
                  <motion.article
                    key={p.t}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05 }}
                    className="card-hover p-6"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-forest-50 text-forest-700">
                      <Icon size={20} />
                    </div>
                    <h3 className="mt-4 font-semibold text-ink-900">{p.t}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-ink-500">{p.b}</p>
                  </motion.article>
                );
              })}
            </div>
          </div>
        </section>

        <section id="pathways" className="scroll-mt-24 py-16">
          <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 lg:grid-cols-2">
            <div>
              <h2 className="font-serif text-2xl font-semibold text-ink-900 sm:text-3xl">{t.pathways.title}</h2>
              <p className="mt-3 text-sm leading-relaxed text-ink-500">{t.pathways.body}</p>
              <ul className="mt-6 space-y-3 text-sm text-ink-700">
                {t.pathways.points.map(p => (
                  <li key={p} className="flex gap-2">
                    <BadgeCheck size={18} className="mt-0.5 shrink-0 text-forest-600" />
                    {p}
                  </li>
                ))}
              </ul>
            </div>
            <div className="card p-6">
              <p className="text-xs font-semibold uppercase tracking-wide text-forest-600">{t.pathways.sample}</p>
              {[
                { n: 'Yoga therapy', v: 88 },
                { n: 'Panchakarma protocols', v: 78 },
                { n: 'Clinical documentation', v: 54 },
              ].map(s => (
                <div key={s.n} className="mt-4">
                  <div className="mb-1 flex justify-between text-sm">
                    <span>{s.n}</span>
                    <span className="font-semibold text-forest-700">{s.v}</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                    <motion.div
                      className="h-full rounded-full bg-forest-600"
                      initial={{ width: 0 }}
                      whileInView={{ width: `${s.v}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, ease: 'easeOut' }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="workspaces" className="scroll-mt-24 border-t border-slate-200 bg-white py-16">
          <div className="mx-auto max-w-6xl px-4">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="font-serif text-2xl font-semibold text-ink-900 sm:text-3xl">{t.workspaces.title}</h2>
              <p className="mt-2 text-sm text-ink-500">{t.workspaces.subtitle}</p>
            </div>
            <div className="mt-10">
              <RoleTiles labels={roleLabels} startLabel={t.workspaces.start} onPick={startEntry} />
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
