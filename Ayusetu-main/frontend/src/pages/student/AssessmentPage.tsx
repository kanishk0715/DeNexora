import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Clock } from 'lucide-react';
import { PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, RadarChart, ResponsiveContainer } from 'recharts';
import { PageHeader } from '../../components/ui/Primitives';
import { ReadinessRing } from '../../components/ui/ReadinessRing';
import { QuestionArt } from '../../components/assessment/QuestionArt';
import { ASSESSMENT_QUESTIONS, DEMO_SKILLS } from '../../data/demo';
import { useToast } from '../../contexts/ToastContext';

const TOTAL = 8 * 60;

const RESULTS = [
  { n: 'Panchakarma protocols', s: 78, gap: false },
  { n: 'Yoga therapy', s: 88, gap: false },
  { n: 'Clinical documentation', s: 54, gap: true },
];

const RADAR = DEMO_SKILLS.slice(0, 5).map(s => ({
  skill: s.name.replace(' protocols', '').replace('Clinical ', ''),
  you: s.score,
  bench: s.benchmark,
}));

function formatTime(s: number) {
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m}:${r.toString().padStart(2, '0')}`;
}

export default function AssessmentPage() {
  const { toast } = useToast();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [done, setDone] = useState(false);
  const [seconds, setSeconds] = useState(TOTAL);
  const q = ASSESSMENT_QUESTIONS[step];
  const pct = ((step + (answers[q?.id] !== undefined ? 0.35 : 0)) / ASSESSMENT_QUESTIONS.length) * 100;
  const urgent = seconds <= 60;

  useEffect(() => {
    if (done) return;
    const id = window.setInterval(() => setSeconds(s => Math.max(0, s - 1)), 1000);
    return () => window.clearInterval(id);
  }, [done]);

  useEffect(() => {
    if (seconds === 0 && !done) {
      setDone(true);
      toast('info', 'Time is up — scoring from answers so far.');
    }
  }, [seconds, done, toast]);

  if (done) {
    return (
      <div className="mx-auto max-w-3xl">
        <PageHeader
          kicker="Skill assessment"
          title="Profile updated"
          subtitle="Scores written to your skill map. Gaps now drive internship ranking."
        />
        <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="grid gap-6 lg:grid-cols-2">
          <div className="card p-6 sm:p-8">
            <ReadinessRing value={76} label="Composite" />
            <ul className="mt-6 space-y-3 text-sm">
              {RESULTS.map(r => (
                <li
                  key={r.n}
                  className={`flex justify-between rounded-xl px-4 py-3 ${r.gap ? 'bg-saffron-50' : 'bg-cream-100'}`}
                >
                  <span>{r.n}</span>
                  <span className={`font-semibold ${r.gap ? 'text-saffron-700' : 'text-forest-800'}`}>
                    {r.s}
                    {r.gap ? ' · gap' : ''}
                  </span>
                </li>
              ))}
            </ul>
            <div className="mt-6 flex flex-wrap gap-2">
              <Link to="/skills" className="btn-primary">
                Open skill map
              </Link>
              <Link to="/opportunities" className="btn-secondary">
                See ranked internships
              </Link>
            </div>
          </div>
          <div className="card p-6">
            <p className="text-xs font-semibold uppercase tracking-wide text-forest-600">Skill radar</p>
            <p className="mt-1 text-sm text-ink-500">You vs industry benchmark</p>
            <div className="mt-2 h-72">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={RADAR} cx="50%" cy="50%" outerRadius="70%">
                  <PolarGrid stroke="#e7ebf1" />
                  <PolarAngleAxis dataKey="skill" tick={{ fontSize: 11, fill: '#334155' }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 10 }} />
                  <Radar name="You" dataKey="you" stroke="#1d4e89" fill="#1d4e89" fillOpacity={0.35} />
                  <Radar name="Benchmark" dataKey="bench" stroke="#8f6246" fill="#8f6246" fillOpacity={0.12} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader
        kicker="Skill assessment"
        title="AYUSH competency check"
        subtitle="Tap an answer. The timer is for the full paper — results feed match scores."
        actions={
          <div
            className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-semibold tabular-nums ${
              urgent ? 'border-saffron-200 bg-saffron-50 text-saffron-700' : 'border-slate-200 bg-white text-forest-800'
            }`}
          >
            <Clock size={16} />
            {formatTime(seconds)}
          </div>
        }
      />
      <div className="mb-3 flex gap-1.5">
        {ASSESSMENT_QUESTIONS.map((_, i) => (
          <span
            key={i}
            className={`h-1.5 flex-1 rounded-full transition ${i < step ? 'bg-forest-600' : i === step ? 'bg-forest-400' : 'bg-white'}`}
          />
        ))}
      </div>
      <div className="mb-5 h-2 overflow-hidden rounded-full bg-white">
        <div className="progress-line" style={{ width: `${Math.max(8, pct)}%` }} />
      </div>
      <div className="card overflow-hidden p-6 sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-wide text-ink-500">
          Question {step + 1} of {ASSESSMENT_QUESTIONS.length}
        </p>
        <AnimatePresence mode="wait">
          <motion.div key={q.id} initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }}>
            <div className="mt-4 overflow-hidden rounded-2xl">
              <QuestionArt id={q.id} />
            </div>
            <h2 className="mt-4 text-xl font-semibold text-ink-900">{q.text}</h2>
            <div className="mt-6 space-y-2">
              {q.options.map((opt, i) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setAnswers(a => ({ ...a, [q.id]: i }))}
                  className={`w-full rounded-xl border px-4 py-3.5 text-left text-sm transition ${
                    answers[q.id] === i
                      ? 'border-forest-700 bg-forest-50 font-medium shadow-sm ring-2 ring-forest-700/20'
                      : 'border-slate-200 hover:border-forest-300 hover:bg-cream-50'
                  }`}
                >
                  <span className="mr-2 text-xs font-bold text-slate-400">{String.fromCharCode(65 + i)}</span>
                  {opt}
                </button>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
        <div className="mt-6 flex justify-between">
          <button type="button" className="btn-secondary" disabled={step === 0} onClick={() => setStep(s => s - 1)}>
            Back
          </button>
          <button
            type="button"
            className="btn-primary"
            disabled={answers[q.id] === undefined}
            onClick={() => {
              if (step === ASSESSMENT_QUESTIONS.length - 1) {
                setDone(true);
                toast('success', 'Assessment scored. Skill map updated.');
              } else setStep(s => s + 1);
            }}
          >
            {step === ASSESSMENT_QUESTIONS.length - 1 ? 'Submit & score' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
}
