import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
  Sparkles,
  Landmark,
} from 'lucide-react';
import { Logo } from '../components/Logo';
import { useAuth } from '../contexts/AuthContext';
import type { User } from '../types/api';
import LiveMatchCard from '../components/landing/LiveMatchCard';

const PILLARS = [
  {
    icon: GraduationCap,
    title: 'Unified student profiles',
    body: 'Verified academic records, AYUSH certifications and hands-on clinical skills in one digital profile.',
    span: 'lg:col-span-2',
  },
  {
    icon: Building2,
    title: 'Industry requirement portal',
    body: 'Hospitals and wellness centres post real hiring needs against a shared skill ontology.',
    span: '',
  },
  {
    icon: Brain,
    title: 'AI-powered skill mapping',
    body: 'Scores profiles against requirements and surfaces the gaps that block a fair match.',
    span: '',
  },
  {
    icon: Briefcase,
    title: 'Internship & placement tracker',
    body: 'Apply, shortlist, interview and confirm offers from a single pipeline.',
    span: '',
  },
  {
    icon: BarChart3,
    title: 'Institution & ministry analytics',
    body: 'Placement trends and skill-gap reports for colleges and the Ministry of AYUSH.',
    span: 'lg:col-span-2',
  },
];

const STEPS = [
  { n: '01', t: 'Student skill profiles', d: 'Capture BAMS / BNYS / BUMS / BSMS / BHMS skills with verification.' },
  { n: '02', t: 'Industry requirement postings', d: 'Hospitals tag seats using the same AYUSH ontology.' },
  { n: '03', t: 'AI matching engine', d: 'Overlap + verified-skill weight → a transparent match %.' },
  { n: '04', t: 'Verified matches', d: 'Consent-based apply, shortlist, interview, offer.' },
  { n: '05', t: 'Ministry insights', d: 'National skill-gap heat for curriculum and policy.' },
];

const DEMO_ROLES: { role: User['role']; label: string; hint: string; icon: typeof Users; tone: string }[] = [
  { role: 'student', label: 'Student', hint: 'Match, apply, track internships', icon: GraduationCap, tone: 'from-forest-700 to-forest-900' },
  { role: 'industry', label: 'Industry', hint: 'Post needs and shortlist talent', icon: Briefcase, tone: 'from-saffron-600 to-saffron-700' },
  { role: 'institution', label: 'Institution', hint: 'Verify credentials and place', icon: Building2, tone: 'from-emerald-800 to-forest-800' },
  { role: 'admin', label: 'Ministry', hint: 'National skill-bridge insights', icon: Landmark, tone: 'from-stone-800 to-forest-900' },
];

export default function LandingPage() {
  const { enterDemo } = useAuth();
  const navigate = useNavigate();
  const [openStep, setOpenStep] = useState(2);

  return (
    <div className="min-h-screen text-ink-900">
      <header className="sticky top-0 z-30 border-b border-white/40 bg-cream-50/75 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3.5">
          <Logo />
          <div className="flex items-center gap-3">
            <Link to="/login" className="hidden text-sm font-semibold text-forest-800 sm:inline hover:text-saffron-600">
              Sign in
            </Link>
            <Link to="/register" className="btn-primary">
              Create account
            </Link>
          </div>
        </div>
      </header>

      <section className="mesh-hero relative overflow-hidden">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-14 lg:grid-cols-2 lg:py-20">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <span className="inline-flex items-center gap-2 rounded-full border border-saffron-200 bg-white/70 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-saffron-700 shadow-sm">
              <Sparkles size={14} /> AYUSH skill bridge
            </span>
            <h1 className="mt-5 font-serif text-4xl font-semibold leading-[1.12] text-forest-900 sm:text-5xl lg:text-[3.4rem]">
              Internships that fit your{' '}
              <span className="bg-gradient-to-r from-forest-700 to-saffron-500 bg-clip-text text-transparent">real clinical skills</span>
              .
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-ink-500">
              AyuSetu maps verified student profiles to hospital and wellness requirements — then tracks every offer from apply to join.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/register" className="btn-primary">
                Join the portal <ArrowRight size={16} />
              </Link>
              <a href="#demo" className="btn-secondary">
                Explore interactive prototype
              </a>
            </div>
            <div className="mt-10 grid max-w-lg grid-cols-3 gap-3">
              {[
                ['48k+', 'students mapped'],
                ['1k+', 'live internships'],
                ['81%', 'avg. AI match'],
              ].map(([n, l]) => (
                <div key={l} className="rounded-2xl border border-white/70 bg-white/50 px-3 py-3 text-center backdrop-blur">
                  <p className="font-serif text-xl font-semibold text-forest-800">{n}</p>
                  <p className="text-[11px] text-ink-500">{l}</p>
                </div>
              ))}
            </div>
            <div className="mt-6 flex flex-wrap gap-5 text-sm text-ink-500">
              <span className="flex items-center gap-2">
                <ShieldCheck size={16} className="text-forest-600" /> DPDP consent
              </span>
              <span className="flex items-center gap-2">
                <BadgeCheck size={16} className="text-forest-600" /> Verified credentials
              </span>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.55, delay: 0.1 }}>
            <LiveMatchCard />
          </motion.div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="font-serif text-3xl font-semibold text-forest-900">How matching works</h2>
        <p className="mt-2 text-sm text-ink-500">Tap a step — the engine is designed as one loop, not five disconnected portals.</p>
        <div className="mt-8 space-y-2">
          {STEPS.map((s, i) => {
            const open = openStep === i;
            return (
              <button
                key={s.n}
                type="button"
                onClick={() => setOpenStep(i)}
                className={`w-full rounded-2xl border px-5 py-4 text-left transition ${
                  open
                    ? 'border-forest-300 bg-white shadow-lift'
                    : 'border-transparent bg-white/40 hover:bg-white/80'
                }`}
              >
                <div className="flex items-center gap-4">
                  <span className={`font-serif text-2xl ${open ? 'text-saffron-600' : 'text-stone-300'}`}>{s.n}</span>
                  <div>
                    <p className="font-semibold text-forest-900">{s.t}</p>
                    {open && <p className="mt-1 text-sm text-ink-500">{s.d}</p>}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      <section className="border-y border-stone-200/80 bg-white/50 py-16">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="font-serif text-3xl font-semibold text-forest-900">Five capabilities, one bridge</h2>
          <p className="mt-2 max-w-2xl text-sm text-ink-500">
            Academia–industry collaboration for skill mapping, internships and placement — purpose-built for AYUSH.
          </p>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {PILLARS.map(p => {
              const Icon = p.icon;
              return (
                <article key={p.title} className={`card-hover group p-6 ${p.span}`}>
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-forest-50 text-forest-700 transition group-hover:scale-110 group-hover:bg-forest-700 group-hover:text-white">
                    <Icon size={20} />
                  </div>
                  <h3 className="mt-4 font-serif text-xl text-forest-900">{p.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-500">{p.body}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section id="demo" className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="font-serif text-3xl font-semibold text-forest-900">Step into a workspace</h2>
        <p className="mt-2 text-sm text-ink-500">Interactive prototype with sample AYUSH data. Pick a role — no database required.</p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {DEMO_ROLES.map(r => {
            const Icon = r.icon;
            return (
              <motion.button
                key={r.role}
                type="button"
                whileHover={{ y: -6 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  enterDemo(r.role);
                  navigate('/dashboard');
                }}
                className="group overflow-hidden rounded-2xl text-left shadow-card"
              >
                <div className={`bg-gradient-to-br ${r.tone} px-5 pb-8 pt-5 text-white`}>
                  <Icon className="opacity-90" size={22} />
                  <p className="mt-6 font-serif text-2xl">{r.label}</p>
                </div>
                <div className="bg-white px-5 py-4">
                  <p className="text-sm text-ink-500">{r.hint}</p>
                  <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-saffron-600 group-hover:underline">
                    Enter workspace →
                  </p>
                </div>
              </motion.button>
            );
          })}
        </div>
      </section>

      <footer className="border-t border-stone-200 bg-forest-900 py-10 text-cream-200">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 text-sm sm:flex-row sm:items-center sm:justify-between">
          <span className="font-serif text-lg text-cream-50">AyuSetu</span>
          <span>Ministry of AYUSH pathways · CCRAS internship guidelines</span>
        </div>
      </footer>
    </div>
  );
}
