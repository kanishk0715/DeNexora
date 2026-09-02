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

const FEATURE_ICONS = [GraduationCap, Building2, Brain, Briefcase, BarChart3, BookOpen];
const FEATURE_IMAGES = ['/1.jpeg', '/2.jpeg', '/3.jpeg', '/4.jpeg', '/5.jpeg', '/6.jpeg'];

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
            className={`group relative overflow-hidden rounded-2xl border-2 p-8 text-left shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl ${
              on 
                ? 'border-forest-500 bg-gradient-to-br from-forest-50 to-forest-100 ring-4 ring-forest-500/20' 
                : 'border-slate-200 bg-white hover:border-forest-300 hover:bg-gradient-to-br hover:from-white hover:to-forest-50/30'
            }`}
          >
            <div className="absolute top-0 right-0 h-32 w-32 translate-x-8 -translate-y-8 rounded-full bg-gradient-to-br from-forest-400/10 to-saffron-400/10 blur-2xl transition-transform duration-300 group-hover:scale-150" />
            <div className="relative">
              <span className={`flex h-14 w-14 items-center justify-center rounded-2xl shadow-lg transition-all duration-300 group-hover:scale-110 ${
                on ? 'bg-gradient-to-br from-forest-600 to-forest-700 text-white' : 'bg-gradient-to-br from-forest-50 to-forest-100 text-forest-700'
              }`}>
                <Icon size={24} />
              </span>
              <p className="mt-5 text-xl font-bold text-ink-900">{copy.label}</p>
              <p className="mt-2 text-sm leading-relaxed text-ink-600">{copy.hint}</p>
              <p className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-forest-700">
                {startLabel}
                <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
              </p>
            </div>
          </button>
        );
      })}
    </div>
  );
}

const PARTNER_ROLES: User['role'][] = ['academician', 'industry', 'institution'];

type Gate = 'choose' | 'partner' | 'questions';

type Question = { id: string; label: string; options: string[]; multi?: boolean; max?: number };

const QUESTIONS: Record<string, Question[]> = {
  student: [
    { id: 'stream', label: 'Which AYUSH stream are you in?', options: ['BAMS', 'BNYS', 'BUMS', 'BSMS', 'BHMS'] },
    { id: 'year', label: 'Which year are you in?', options: ['1st year', '2nd year', '3rd year', 'Final year', 'Internship'] },
    { id: 'goal', label: 'What are you looking for?', options: ['Internship', 'Job / placement', 'Both'] },
    {
      id: 'skill',
      label: 'Which subjects should we assess?',
      multi: true,
      max: 3,
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

function studentQuestions(): Question[] {
  return QUESTIONS.student;
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

  const questions = role === 'student' ? studentQuestions() : role ? QUESTIONS[role] ?? [] : [];
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
      ? 'Pick up to 3 subjects. The same papers are offered for BAMS, BNYS, BUMS, BSMS and BHMS.'
      : gate === 'questions'
        ? t.modal.help
        : gate === 'partner'
          ? 'Choose how you work with AYUSH talent.'
          : t.modal.then;

  const finish = () => {
    if (!role || !complete) return;
    sessionStorage.setItem(ONBOARDING_KEY, JSON.stringify({ role, answers }));
    enterDemo(role);
    if (role === 'student') navigate('/assessment');
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
    <div className="flex min-h-screen flex-col bg-transparent text-ink-900">
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
                  const selectedCount = Array.isArray(value) ? value.length : 0;
                  const atLimit = Boolean(q.max && selectedCount >= q.max);
                  return (
                    <fieldset key={q.id}>
                      <legend className="text-sm font-semibold text-ink-900">
                        {i + 1}. {q.label}
                        {q.multi && (
                          <span className="ml-2 font-normal text-ink-500">
                            {q.max ? `Choose up to ${q.max}` : 'Select all that apply'}
                            {q.max ? ` · ${selectedCount}/${q.max}` : ''}
                          </span>
                        )}
                      </legend>
                      <div className={`mt-2 flex flex-wrap gap-2 ${q.id === 'skill' ? 'flex-col sm:flex-row' : ''}`}>
                        {opts.map(opt => {
                          const on = picked(opt.id);
                          const blocked = atLimit && !on;
                          return (
                          <button
                            key={opt.id}
                            type="button"
                            disabled={blocked}
                            aria-disabled={blocked}
                            onClick={() =>
                              setAnswers(a => {
                                if (q.id === 'stream') {
                                  return { ...a, stream: opt.id };
                                }
                                if (!q.multi) return { ...a, [q.id]: opt.id };
                                const cur = Array.isArray(a[q.id]) ? [...(a[q.id] as string[])] : [];
                                if (cur.includes(opt.id)) return { ...a, [q.id]: cur.filter(x => x !== opt.id) };
                                if (q.max && cur.length >= q.max) return a;
                                return { ...a, [q.id]: [...cur, opt.id] };
                              })
                            }
                            className={`rounded-xl border px-3 py-1.5 text-left text-sm transition ${
                              q.id === 'skill' ? 'sm:w-[calc(50%-0.25rem)]' : 'rounded-full'
                            } ${
                              on
                                ? 'border-forest-600 bg-forest-600 text-white'
                                : blocked
                                  ? 'cursor-not-allowed border-slate-200 bg-slate-50 text-ink-400'
                                  : 'border-slate-200 bg-white text-ink-700 hover:border-forest-300'
                            }`}
                          >
                            <span className="font-medium">{opt.label}</span>
                            {opt.hint ? (
                              <span className={`mt-0.5 block text-[11px] ${on ? 'text-white/80' : 'text-ink-500'}`}>
                                {opt.hint}
                              </span>
                            ) : null}
                          </button>
                          );
                        })}
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
                {role === 'student' ? 'Start subject assessment' : t.modal.continue}
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
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(255,255,255,0.70)_0%,_rgba(255,255,255,0.42)_50%,_rgba(255,255,255,0.18)_100%)]" />
            <div className="absolute inset-0 bg-gradient-to-b from-white/25 via-transparent to-white" />
          </div>
          <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-4 pb-16 pt-12 lg:grid-cols-2 lg:pb-20 lg:pt-16">
            <div className="text-center lg:text-left">
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 rounded-full border-2 border-saffron-200 bg-gradient-to-r from-saffron-50 to-saffron-100 px-4 py-2 text-xs font-bold text-saffron-800 shadow-lg shadow-saffron-200/50"
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-saffron-600 opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-saffron-600"></span>
              </span>
              {t.hero.badge}
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="mt-6 font-serif text-4xl font-bold leading-[1.12] tracking-tight text-ink-900 sm:text-5xl lg:text-6xl"
            >
              <span className="gradient-text">{t.hero.title.split(' ').slice(0, 3).join(' ')}</span>
              <br />
              {t.hero.title.split(' ').slice(3).join(' ')}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-ink-600 lg:mx-0"
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
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-sm text-ink-600 lg:justify-start">
              <span className="flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 shadow-sm backdrop-blur-sm">
                <ShieldCheck size={18} className="text-forest-600" /> 
                <span className="font-semibold">{t.hero.consent}</span>
              </span>
              <span className="flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 shadow-sm backdrop-blur-sm">
                <BadgeCheck size={18} className="text-forest-600" /> 
                <span className="font-semibold">{t.hero.verified}</span>
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

        <section id="roles" className="relative z-[1] mx-auto max-w-6xl scroll-mt-24 px-4 py-16 sm:py-20">
          <div className="text-center">
            <p className="text-xs font-bold uppercase tracking-wider text-forest-700">{t.modal.kicker}</p>
            <h2 className="mt-3 font-serif text-3xl font-bold text-ink-900 sm:text-4xl">{t.modal.choose}</h2>
            <p className="mx-auto mt-3 max-w-2xl text-base text-ink-600">{t.modal.then}</p>
          </div>
          <div className="mt-10">
            <RoleTiles labels={roleLabels} startLabel={t.workspaces.start} onPick={startEntry} />
          </div>
        </section>

        <section className="relative z-[1] border-y-2 border-forest-100 bg-gradient-to-r from-forest-50/50 via-white to-saffron-50/50 py-12 backdrop-blur-sm">
          <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 px-4 sm:grid-cols-4">
            {t.stats.map(s => (
              <div key={s.l} className="group text-center">
                <p className="font-serif text-3xl font-bold tabular-nums text-forest-700 transition-all duration-300 group-hover:scale-110 sm:text-4xl">
                  <CountUp value={s.n} />
                  <span className="text-saffron-600">+</span>
                </p>
                <p className="mt-2 text-xs font-semibold text-ink-600 sm:text-sm">{s.l}</p>
              </div>
            ))}
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

        <section id="how-it-works" className="scroll-mt-24 bg-gradient-to-br from-forest-50/30 via-white to-saffron-50/20 py-20">
          <div className="mx-auto max-w-7xl px-4">
            {/* Header */}
            <div className="mx-auto max-w-3xl text-center">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <span className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-forest-100 to-saffron-100 px-4 py-2 text-xs font-bold uppercase tracking-wider text-forest-800">
                  <span className="flex h-2 w-2 rounded-full bg-forest-600"></span>
                  Simple Process
                </span>
              </motion.div>
              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="mt-4 font-serif text-3xl font-bold text-ink-900 sm:text-4xl lg:text-5xl"
              >
                {t.how.title}
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.15 }}
                className="mt-4 text-base text-ink-600 sm:text-lg"
              >
                {t.how.subtitle}
              </motion.p>
            </div>

            {/* Steps Grid */}
            <div className="relative mt-16">
              {/* Connecting Line - Desktop only */}
              <div className="absolute left-0 right-0 top-12 hidden h-1 bg-gradient-to-r from-forest-200 via-forest-300 to-forest-200 lg:block" style={{ zIndex: 0 }} />
              
              <ol className="relative grid gap-6 sm:grid-cols-2 lg:grid-cols-5" style={{ zIndex: 1 }}>
                {t.how.steps.map((s, i) => (
                  <motion.li
                    key={s.t}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    onClick={() => setHowStep(i)}
                    onMouseEnter={() => setHowStep(i)}
                    className={`group relative cursor-pointer transition-all duration-300 ${
                      howStep === i ? 'scale-105' : 'hover:scale-105'
                    }`}
                  >
                    {/* Card */}
                    <div
                      className={`relative h-full overflow-hidden rounded-2xl border-2 bg-white p-6 shadow-lg transition-all duration-300 ${
                        howStep === i
                          ? 'border-forest-500 shadow-2xl shadow-forest-500/20'
                          : 'border-slate-200 hover:border-forest-300 hover:shadow-xl'
                      }`}
                    >
                      {/* Gradient Background */}
                      <div className={`absolute inset-0 bg-gradient-to-br transition-opacity duration-300 ${
                        howStep === i 
                          ? 'from-forest-50 to-saffron-50 opacity-100' 
                          : 'from-forest-50/30 to-transparent opacity-0 group-hover:opacity-100'
                      }`} />
                      
                      {/* Content */}
                      <div className="relative">
                        {/* Number Badge */}
                        <div className={`inline-flex h-14 w-14 items-center justify-center rounded-2xl font-serif text-2xl font-bold shadow-lg transition-all duration-300 ${
                          howStep === i
                            ? 'bg-gradient-to-br from-forest-600 to-forest-700 text-white scale-110'
                            : 'bg-gradient-to-br from-forest-100 to-forest-200 text-forest-800 group-hover:scale-110'
                        }`}>
                          {i + 1}
                        </div>
                        
                        {/* Step Label */}
                        <div className={`mt-1 inline-block rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider transition-colors ${
                          howStep === i
                            ? 'bg-forest-600 text-white'
                            : 'bg-forest-100 text-forest-700'
                        }`}>
                          Step {i + 1}
                        </div>

                        {/* Title */}
                        <h3 className="mt-4 text-lg font-bold text-ink-900 leading-snug">{s.t}</h3>
                        
                        {/* Description */}
                        <p className="mt-2 text-sm leading-relaxed text-ink-600">{s.b}</p>

                        {/* Arrow indicator for active step */}
                        {howStep === i && (
                          <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="mt-3 flex items-center gap-2 text-xs font-semibold text-forest-700"
                          >
                            <ArrowRight size={14} />
                            <span>Current step</span>
                          </motion.div>
                        )}
                      </div>

                      {/* Hover Glow Effect */}
                      <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-gradient-to-br from-forest-400/20 to-saffron-400/20 blur-2xl transition-opacity duration-300 group-hover:opacity-100 opacity-0" />
                    </div>

                    {/* Arrow between cards - Desktop only */}
                    {i < t.how.steps.length - 1 && (
                      <div className="absolute -right-3 top-12 z-10 hidden h-6 w-6 items-center justify-center rounded-full bg-forest-500 text-white shadow-lg lg:flex">
                        <ArrowRight size={14} />
                      </div>
                    )}
                  </motion.li>
                ))}
              </ol>
            </div>

            {/* Bottom CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className="mt-12 text-center"
            >
              <div className="inline-flex items-center gap-3 rounded-2xl border-2 border-forest-200 bg-white px-6 py-4 shadow-lg">
                <span className="text-sm font-medium text-ink-600">Want to learn more?</span>
                <Link 
                  to="/about" 
                  className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-forest-600 to-forest-700 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:shadow-lg hover:shadow-forest-500/30 hover:scale-105"
                >
                  {t.footer.about}
                  <ArrowRight size={16} />
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        <section id="features" className="scroll-mt-24 border-y-2 border-forest-100 bg-gradient-to-b from-white via-forest-50/20 to-white py-20">
          <div className="mx-auto max-w-6xl px-4">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="font-serif text-3xl font-bold text-ink-900 sm:text-4xl">{t.features.title}</h2>
              <p className="mt-3 text-base text-ink-600">{t.features.subtitle}</p>
            </div>
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {t.features.items.map((p, i) => {
                const Icon = FEATURE_ICONS[i] ?? Brain;
                const img = FEATURE_IMAGES[i];
                return (
                  <motion.article
                    key={p.t}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08 }}
                    className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-md transition-all duration-300 hover:-translate-y-2 hover:border-forest-300 hover:shadow-2xl"
                  >
                    {/* Image header */}
                    <div className="relative h-44 w-full overflow-hidden">
                      <img
                        src={img}
                        alt={p.t}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      {/* gradient fade into card body */}
                      <div className="absolute inset-0 bg-gradient-to-t from-white via-white/20 to-transparent" />
                      {/* icon floating on image bottom-left */}
                      <div className="absolute bottom-3 left-4 flex h-11 w-11 items-center justify-center rounded-xl bg-white/90 text-forest-700 shadow-lg backdrop-blur-sm">
                        <Icon size={20} />
                      </div>
                    </div>

                    {/* Card body */}
                    <div className="px-6 pb-6 pt-3">
                      <h3 className="text-base font-bold text-ink-900">{p.t}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-ink-500">{p.b}</p>
                    </div>
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

            {/* Skill bars card */}
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

        <section id="partners" className="scroll-mt-24 bg-white py-16 border-t border-slate-200">
          <div className="mx-auto max-w-6xl px-4">
            <div className="text-center">
              <p className="text-xs font-bold uppercase tracking-wider text-saffron-700">{t.partners.kicker}</p>
              <h2 className="mt-3 text-2xl font-bold text-ink-900 sm:text-3xl">{t.partners.title}</h2>
            </div>
            <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
              {PARTNERS.map(p => (
                <article
                  key={p.ab}
                  className="group relative overflow-hidden rounded-xl border-2 border-slate-200 bg-gradient-to-br from-white to-forest-50/30 px-4 py-6 text-center shadow-md transition-all duration-300 hover:-translate-y-1 hover:border-forest-300 hover:shadow-xl"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-forest-500/0 to-forest-500/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  <div className="relative">
                    <span className="text-base font-extrabold tracking-wide text-forest-800">{p.ab}</span>
                    <span className="mt-2 block line-clamp-2 text-[11px] font-medium leading-snug text-ink-600">{p.name}</span>
                    <span className="mt-1 block text-[10px] font-semibold text-saffron-600">{p.city}</span>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
